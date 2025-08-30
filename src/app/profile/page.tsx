import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ShareProfileButton from '@/components/profile/ShareProfileButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import "react-toastify/dist/ReactToastify.css";
import { Button } from '@/components/ui/button';
import NotificationButtons from '@/components/profile/NotificationButtons';
import PromocodeItem from '@/components/promocodes';
import Link from 'next/link';
import ImageWithFallback from '@/components/ImageWithFallback';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

interface C4Data {
  id: string;
  date: string;
  map: string;
  kills: number;
  result: 'Выигран' | 'Проигран' | 'В процессе';
}

interface BattleHistoryData {
  c4: {
    id: any;
    map: string;
    startedAt: Date | null;
    endedAt: Date | null;
    status: string;
    result: string;
  };
  killGain: number;
}

export default async function ProfilePage() {
  const session = await auth();

  // Если пользователь не авторизован
  if (!session?.user) {
    redirect('/login');
  }

  const { user } = session;

  // Получаем полные данные пользователя с связанными сущностями
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      player: {
        include: {
          c4Stats: {
            take: 5,
            orderBy: { c4: { startedAt: 'desc' } },
            include: { c4: true }
          }
        }
      },
      alerts: {
        where: { isRead: false },
        orderBy: { createdAt: 'desc' }
      },
      techSlots: true
    }
  });

  console.log("", fullUser);
  console.log(fullUser?.alerts);
  console.log(fullUser?.techSlots);
  console.log(fullUser?.player?.c4Stats);


  if (!fullUser) {
    redirect('/login');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/promocode`
  );
  const promocodes = await response.json();
  const sortedPromocodes = [...promocodes.data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let playerStats = null;
  let battleHistoryData: BattleHistoryData[] = [];

  if (fullUser.player) {
    playerStats = {
      power: fullUser.player.power,
      kill: fullUser.player.kill,
      die: fullUser.player.die,
      kd: fullUser.player.kd,
      resourceCollection: fullUser.player.resourceCollection,
      techPower: fullUser.player.techPower,
      airPower: fullUser.player.airPower,
      navyPower: fullUser.player.navyPower,
      groundPower: fullUser.player.groundPower,
    };

    battleHistoryData = fullUser.player.c4Stats as BattleHistoryData[];
  }

  // Функция для форматирования больших чисел
  function formatLargeNumber(num: bigint | number | null | undefined): string {
    if (num === null || num === undefined) return '0';

    const numValue = typeof num === 'bigint' ? Number(num) : num;

    // Для очень больших чисел используем сокращения
    if (numValue >= 1000000000) {
      return (numValue / 1000000000).toFixed(1).replace('.', ',') + ' млрд';
    }
    if (numValue >= 1000000) {
      return (numValue / 1000000).toFixed(1).replace('.', ',') + ' млн';
    }
    if (numValue >= 1000) {
      return (numValue / 1000).toFixed(1).replace('.', ',') + ' тыс';
    }

    // Для обычных чисел добавляем разделители тысяч
    return numValue.toLocaleString('ru-RU');
  }

  // Функция для расчета процентного соотношения сил
  function calculateForcePercentages(ground: number, air: number, navy: number) {
    const total = ground + air + navy;
    if (total === 0) return { ground: 0, air: 0, navy: 0 };

    return {
      ground: Math.round((ground / total) * 100),
      air: Math.round((air / total) * 100),
      navy: Math.round((navy / total) * 100)
    };
  }

  function getRussianMapName(mapCode: string): string {
    const maps: { [key: string]: string } = {
      cairo: "Каир",
      newyork: "Нью-Йорк",
      moscow: "Москва",
      sea: "Эгейское море",
      vancouver: "Ванкувер",
      berlin: "Берлин",
      paris: "Париж",
      london: "Лондон",
      rome: "Рим",
      chicago: "Чикаго",
      sanfrancisco: "Сан-Франциско",
    };

    return maps[mapCode] || mapCode;
  }

  // Преобразуем данные для истории сражений
  const battleHistory: C4Data[] = battleHistoryData.map((stat) => {
    const startDate = stat.c4.startedAt ? new Date(stat.c4.startedAt).toLocaleDateString('ru-RU') : 'Неизвестно';
    const endDate = stat.c4.endedAt ? new Date(stat.c4.endedAt).toLocaleDateString('ru-RU') : 'Неизвестно';

    // Определяем результат
    let result: 'Выигран' | 'Проигран' | 'В процессе';
    if (stat.c4.status === 'active' || stat.c4.result === 'In process') {
      result = 'В процессе';
    } else {
      result = stat.c4.result === 'win' ? 'Выигран' : 'Проигран';
    }

    return {
      id: stat.c4.id,
      date: `${startDate} - ${endDate}`,
      map: getRussianMapName(stat.c4.map || 'Неизвестно'),
      kills: stat.killGain || 0,
      result: result
    };
  });

  const avatarImage = `https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userProfile/${fullUser.id}.png`;
  const fallbackAvatar = "/source/help/profile.png";

  return (
    <div className='flex flex-col p-0 md:p-6 max-w-full overflow-x-hidden'>
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Профиль пользователя</h1>
        <ShareProfileButton userId={fullUser.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex-row items-center gap-4">
            <Avatar className="mt-2 h-10 w-10 md:h-12 md:w-12">
              <Image
                className="rounded-full object-cover border-2 border-gray-300"
                src={avatarImage}
                alt={fullUser.username || 'User Avatar'}
                width={128}
                height={128}
              />
              <AvatarFallback>WP</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg md:text-xl leading-tight">{fullUser.username}</CardTitle>
              <CardDescription className="cursor-pointer select-none text-sm md:text-base">
                {fullUser.gameID || 'Не привязан'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-xl text-xs md:text-sm">Альянс: ST</Badge>
              <Badge className="rounded-xl text-xs md:text-sm" variant="default">{fullUser.role}</Badge>
              <Badge
                className="rounded-xl text-xs md:text-sm"
                variant={fullUser.rank as "default" | "secondary" | "destructive" | "outline" | "R1" | "R2" | "R3" | "R4" | "leader" | "officer"}
              >
                {fullUser.rank}
              </Badge>
            </div>
            <div className="grid grid-cols-3 h-full gap-2 text-sm">
              <div className="flex flex-col items-start">
                {fullUser.techSlots
                  ?.filter((slot) => slot.type === 'ground')
                  .map((slot, index) => (
                    <div key={index} className="flex flex-row">
                      <Image
                        src={`/source/nation/${slot.nation}.webp`}
                        alt={`${slot.nation}`}
                        width={32}
                        height={32}
                      />
                      <Image
                        src={`/source/army/Icon-${slot.unit}.webp`}
                        alt={`${slot.unit}`}
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
              </div>
              <div className="flex flex-row items-start">
                {fullUser.techSlots
                  ?.filter((slot) => slot.type === 'air')
                  .map((slot, index) => (
                    <div key={index} className="flex flex-row">
                      <Image
                        src={`/source/nation/${slot.nation}.webp`}
                        alt={`${slot.nation}`}
                        width={32}
                        height={32}
                      />
                      <Image
                        src={`/source/air/Icon-${slot.unit}.webp`}
                        alt={`${slot.unit}`}
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
              </div>
              <div className="flex flex-row items-start">
                {fullUser.techSlots
                  ?.filter((slot) => slot.type === 'naval')
                  .map((slot, index) => (
                    <div key={index} className="flex flex-row">
                      <Image
                        src={`/source/nation/${slot.nation}.webp`}
                        alt={`${slot.nation}`}
                        width={32}
                        height={32}
                      />
                      <Image
                        src={`/source/naval/Icon-${slot.unit}.webp`}
                        alt={`${slot.unit}`}
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Быстрый доступ</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <NotificationButtons userId={fullUser.id} />
          </CardContent>
        </Card>
        <Card className='min-h-[250px] md:min-h-[300px] bg-white rounded-md'>
          <CardHeader>
            <CardTitle className="text-base">Последние промокоды</CardTitle>
          </CardHeader>
          <ul className="p-2 grid gap-2">
            {sortedPromocodes.slice(0, 5).map((promocode, index) => (
              <PromocodeItem key={index} promocode={promocode} />
            ))}
          </ul>
        </Card>
      </div>

      {playerStats && (
        <Card className="mt-4 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Игровая статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <Label className="text-sm text-muted-foreground">Общая мощность</Label>
                <div className="text-2xl font-bold">{formatLargeNumber(playerStats.power)}</div>
              </div>
              <div className="text-center">
                <Label className="text-sm text-muted-foreground">K/D</Label>
                <div className="text-2xl font-bold">{playerStats.kd.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <Label className="text-sm text-muted-foreground">Убийства</Label>
                <div className="text-2xl font-bold">{formatLargeNumber(playerStats.kill)}</div>
              </div>
              <div className="text-center">
                <Label className="text-sm text-muted-foreground">Смерти</Label>
                <div className="text-2xl font-bold">{formatLargeNumber(playerStats.die)}</div>
              </div>
              <div className="text-center">
                <Label className="text-sm text-muted-foreground">Сбор ресурсов</Label>
                <div className="text-2xl font-bold">{formatLargeNumber(playerStats.resourceCollection)}</div>
              </div>
              <div className="text-center">
                <Label className="text-sm text-muted-foreground">Технологии</Label>
                <div className="text-2xl font-bold">{formatLargeNumber(playerStats.techPower)}</div>
              </div>
            </div>

            {/* Визуализация сил - один прогресс-бар с тремя сегментами */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Распределение сил</span>
                  <span className="font-medium">
                    {formatLargeNumber(playerStats.groundPower)} / {formatLargeNumber(playerStats.airPower)} / {formatLargeNumber(playerStats.navyPower)}
                  </span>
                </div>

                <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                  {(() => {
                    const percentages = calculateForcePercentages(
                      playerStats.groundPower || 0,
                      playerStats.airPower || 0,
                      playerStats.navyPower || 0
                    );

                    return (
                      <>
                        {/* Наземные силы - зеленый */}
                        <div
                          className="absolute left-0 top-0 h-full bg-green-500"
                          style={{ width: `${percentages.ground}%` }}
                        />

                        {/* ВВС - синий */}
                        <div
                          className="absolute top-0 h-full bg-blue-500"
                          style={{
                            left: `${percentages.ground}%`,
                            width: `${percentages.air}%`
                          }}
                        />

                        {/* ВМС - голубой */}
                        <div
                          className="absolute top-0 h-full bg-cyan-500"
                          style={{
                            left: `${percentages.ground + percentages.air}%`,
                            width: `${percentages.navy}%`
                          }}
                        />
                      </>
                    );
                  })()}
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                    Земля: {calculateForcePercentages(
                      playerStats.groundPower || 0,
                      playerStats.airPower || 0,
                      playerStats.navyPower || 0
                    ).ground}%
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                    Воздух: {calculateForcePercentages(
                      playerStats.groundPower || 0,
                      playerStats.airPower || 0,
                      playerStats.navyPower || 0
                    ).air}%
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-cyan-500 rounded mr-1"></div>
                    Вода: {calculateForcePercentages(
                      playerStats.groundPower || 0,
                      playerStats.airPower || 0,
                      playerStats.navyPower || 0
                    ).navy}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* таблица C4 */}
      <Card className="mt-4 rounded-2xl w-full">
        <CardHeader>
          <CardTitle className="text-base">История сражений</CardTitle>
          <CardDescription>Последние 5 сражений</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Десктопная версия (таблица) */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="text-left text-sm">
                  <TableHead className="px-4 py-3">Дата</TableHead>
                  <TableHead className="px-4 py-3">Карта</TableHead>
                  <TableHead className="px-4 py-3">Убийства</TableHead>
                  <TableHead className="px-4 py-3">Результат</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {battleHistory.map((c4, i) => {
                  const [startDate, endDate] = c4.date.split(' - ');
                  const isInProgress = c4.result === 'В процессе';

                  return (
                    <TableRow key={i} className="hover:bg-gray-100 text-sm">
                      <TableCell className="px-4 py-3">
                        {isInProgress ? (
                          <div className="flex flex-col">
                            <span>{startDate}</span>
                            <span className="text-xs text-muted-foreground">до {endDate}</span>
                          </div>
                        ) : (
                          <Link
                            href={`/event/${c4.id}`}
                            className="flex flex-col"
                          >
                            <span>{startDate}</span>
                            <span className="text-xs text-muted-foreground">до {endDate}</span>
                          </Link>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {isInProgress ? (
                          c4.map
                        ) : (
                          <Link href={`/battle/${c4.id}`}>
                            {c4.map}
                          </Link>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {isInProgress ? (
                          c4.kills
                        ) : (
                          <Link href={`/battle/${c4.id}`}>
                            {c4.kills}
                          </Link>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {isInProgress ? (
                          <Badge className="rounded-xl" variant="outline">
                            {c4.result}
                          </Badge>
                        ) : (
                          <Link href={`/battle/${c4.id}`}>
                            <Badge className="rounded-xl" variant={c4.result === "Выигран" ? "default" : "secondary"}>
                              {c4.result}
                            </Badge>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Мобильная версия (карточки) */}
          <div className="md:hidden space-y-4">
            {battleHistory.map((c4, i) => {
              const [startDate, endDate] = c4.date.split(' - ');
              const isInProgress = c4.result === 'В процессе';

              return (
                <Card key={i} className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="col-span-2">
                      <div className="font-medium text-muted-foreground">Дата</div>
                      <div>
                        <span>{startDate}</span>
                        <span className="text-muted-foreground"> - {endDate}</span>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-muted-foreground">Карта</div>
                      {isInProgress ? c4.map : (
                        <Link href={`/battle/${c4.id}`}>
                          {c4.map}
                        </Link>
                      )}
                    </div>

                    <div>
                      <div className="font-medium text-muted-foreground">Убийства</div>
                      {isInProgress ? c4.kills : (
                        <Link href={`/battle/${c4.id}`}>
                          {c4.kills}
                        </Link>
                      )}
                    </div>

                    <div className="col-span-2">
                      <div className="font-medium text-muted-foreground">Результат</div>
                      <Badge
                        className="rounded-xl mt-1"
                        variant={
                          isInProgress ? "outline" :
                            c4.result === "Выигран" ? "default" : "secondary"
                        }
                      >
                        {c4.result}
                      </Badge>
                    </div>

                    {!isInProgress && (
                      <div className="col-span-2 text-right">
                        <Link href={`/battle/${c4.id}`}>
                          <Button variant="outline" className="rounded-xl">Подробнее</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}