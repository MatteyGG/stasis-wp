// app/(main)/page.tsx

import { prisma } from "../../lib/prisma";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PromocodeItem from "../../components/promocodes";
import TelegramChat from "@/components/telegramChat";
import C4Card from "@/components/c4/c4Card";

import { unstable_cache } from 'next/cache';

import { formatLargeNumber } from "@/lib/formatLargeNumber";
import { Card } from "@/components/ui/card";
import MvpCarousel from "@/components/mvpCards/MvpCarousel";


// Функция для получения данных MVP с кэшированием
const getCachedMVPData = unstable_cache(
  async () => {
    try {
      const lastFinishedC4 = await prisma.c4.findFirst({
        where: { status: 'finished' },
        orderBy: { endedAt: 'desc' },
        include: {
          statistics: {
            include: {
              player: true
            }
          }
        }
      });

      if (!lastFinishedC4) return { mvps: [], c4Id: null, c4Map: null };

      // Сортируем статистику по разным критериям для MVP
      const topKill = [...lastFinishedC4.statistics]
        .sort((a, b) => (b.killGain || 0) - (a.killGain || 0))[0];

      const topPower = [...lastFinishedC4.statistics]
        .sort((a, b) => (b.powerGain || 0) - (a.powerGain || 0))[0];

      const topKD = [...lastFinishedC4.statistics]
        .sort((a, b) => (b.kdGain || 0) - (a.kdGain || 0))[0];

      const topDie = [...lastFinishedC4.statistics]
        .sort((a, b) => (b.dieGain || 0) - (a.dieGain || 0))[0];

      const topResource = [...lastFinishedC4.statistics]
        .sort((a, b) => {
          const aResource = a.player?.resourceCollection || 0;
          const bResource = b.player?.resourceCollection || 0;
          return Number(bResource) - Number(aResource);
        })[0];


      const mvps = [
        {
          player: topKill,
          category: 'kill',
          title: 'Ультра убийца',
          image: '/kill.png',
          value: topKill?.killGain || 0
        },
        {
          player: topPower,
          category: 'power',
          title: 'Растишка',
          image: '/power.png',
          value: topPower?.powerGain || 0
        },
        {
          player: topKD,
          category: 'kd',
          title: 'Элитный солдат',
          image: '/kd.png',
          value: topKD?.kdGain || 0
        },
        {
          player: topDie,
          category: 'die',
          title: 'Жертвенная овечка',
          image: '/die.png',
          value: topDie?.dieGain || 0
        },

        { 
          player: topResource, 
          category: 'resource',
          title: 'Главный фермер',
          image: '/collect.png',
          value: formatLargeNumber(topResource?.player?.resourceCollection || BigInt(0))
        },
      ];

            // Преобразуем BigInt значения в строки для сериализации
      const serializableMvps = mvps.map(mvp => ({
        ...mvp,
        value: typeof mvp.value === 'bigint' ? formatLargeNumber(mvp.value) : mvp.value,
        player: mvp.player ? {
          ...mvp.player,
          startResourceCollection: mvp.player.startResourceCollection ? formatLargeNumber(mvp.player.startResourceCollection) : null,
          resourceCollectionGain: mvp.player.resourceCollectionGain ? formatLargeNumber(mvp.player.resourceCollectionGain) : null,
          player: mvp.player.player ? {
            ...mvp.player.player,
            resourceCollection: mvp.player.player.resourceCollection ? formatLargeNumber(mvp.player.player.resourceCollection) : null
          } : null
        } : null
      }));

      return {
         mvps: serializableMvps.filter(item => item.player || item.category === 'placeholder'),
        c4Id: lastFinishedC4.id,
        c4Map: lastFinishedC4.map
      };
    } catch (error) {
      console.error('Error fetching MVP data:', error);
      return { mvps: [], c4Id: null, c4Map: null };
    }
  },
  ['mvp-data'],
  { revalidate: 60 * 60 * 24 } // 15 дней в секундах 1296000
);

export default async function Home() {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/promocode`
  );
  const promocodes = await response.json();
  const sortedPromocodes = [...promocodes.data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  console.log("Fetching current C4...");
  const currentC4Promise = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/c4/current`)
    .then((res) => res.json())
    .catch((error) => {
      console.error('Error fetching current C4:', error);
      return null;
    });
  const currentC4 = await currentC4Promise;
  console.log(currentC4);
  const { mvps, c4Id, c4Map } = await getCachedMVPData();


  return (
    <>
      <div className="container mt-4 md:mt-12 mx-auto flex flex-wrap p-2 md:p-4 rounded-xl">
        <MvpCarousel mvps={mvps} c4Id={c4Id} c4Map={c4Map} />

        <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {/* Блок с промокодами */}
          <Card className="md:col-span-1 rounded-2xl">
            <ul className="m-2 md:m-4 mt-8 md:mt-12 grid grid-cols-2 gap-2">
              {sortedPromocodes.slice(0, 10).map((promocode, index) => (
                <PromocodeItem key={index} promocode={promocode} />
              ))}
            </ul>
          </Card>

          {/* Блок с уведомлениями */}
          <Card className="md:col-span-1 rounded-2xl">
            <TelegramChat discussion="stasis_guest/4"
              commentsLimit={4}
              color="#FFFFF"
            />
          </Card>

          {/* Блок C4 */}
          <div className="md:col-span-1">
            <C4Card status={currentC4.status} players={currentC4.totalPlayers} map={currentC4.map} />
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

