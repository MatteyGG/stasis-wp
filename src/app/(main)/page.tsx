import { prisma } from "../../lib/prisma";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PromocodeItem from "../../components/promocodes";
import WikiContainer from "../../components/wiki/wikicontainer";
import { WarpathCard } from "@/components/NewUi/newcomp";
import TelegramChat from "@/components/telegramChat";
import C4Card from "@/components/c4/c4Card";


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";
import { MVPcard } from "@/components/MVPcard";

export default async function Home() {
  const card_array = await prisma.wiki.findMany({
    where: { published: true },
    orderBy: {
      createdAt: "desc",
    },
  });

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
    .catch((error) => null);
  const currentC4 = await currentC4Promise;

  return (
    <>
      <div className="container mt-12 mx-auto flex flex-wrap p-4 rounded-xl ">
        {/* Блок с случайными wiki страницами */} 
        <Carousel className="mt-2 w-full">
          <CarouselContent>
            <CarouselItem className="basis-1/2 md:basis-1/5">
              <MVPcard nickname="Mafon" description="Главный фермер">
                <Image src="/test.jpg" alt="1" width={240} height={400} quality={100} />
              </MVPcard>
            </CarouselItem>
            <CarouselItem className="basis-1/2 md:basis-1/5">
              <MVPcard nickname="Mafon" description="Главный фермер">
                <Image src="/test.jpg" alt="1" width={240} height={400} quality={100} />
              </MVPcard>
            </CarouselItem>
            <CarouselItem className="basis-1/2 md:basis-1/5">
              <MVPcard nickname="Mafon" description="Главный фермер">
                <Image src="/test.jpg" alt="1" width={240} height={400} quality={100} />
              </MVPcard>
            </CarouselItem>
            <CarouselItem className="basis-1/2 md:basis-1/5">
              <MVPcard nickname="Mafon" description="Главный фермер">
                <Image src="/test.jpg" alt="1" width={240} height={400} quality={100} />
              </MVPcard>
            </CarouselItem>
            <CarouselItem className="basis-1/2 md:basis-1/5">
              <MVPcard nickname="Mafon" description="Главный фермер">
                <Image src="/test.jpg" alt="1" width={240} height={400} quality={100} />
              </MVPcard>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <div className="w-full mt-2 grid grid-cols-3 gap-4">
          {/* Блок с промокодами */}
          <WarpathCard>
            {/* <h1 className=" mx-auto text-xl">Промокоды</h1> */}
            <ul className="m-4 mt-12 list-none list-inside grid grid-cols-1 md:grid-cols-2 gap-2">
              {sortedPromocodes.slice(0, 10).map((promocode, index) => (
                <PromocodeItem key={index} promocode={promocode} />
              ))}
            </ul>
          </WarpathCard>
          {/* Блок с уведомлениями */}
          <WarpathCard>
            {/* <p className="text-xl">Гостевой чат</p> */}
            <TelegramChat discussion="stasis_guest/4"
              commentsLimit={10}
              color="#FFFFF"
            />
          </WarpathCard>
          <C4Card status={currentC4.status} players={currentC4.players} map={currentC4.map} />
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

