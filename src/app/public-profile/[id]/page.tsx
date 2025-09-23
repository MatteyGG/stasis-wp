// app/public-profile/[id]/page.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getMapValue } from '@/constants/maps';
import { Label } from '@radix-ui/react-dropdown-menu';

interface C4Data {
  id: string;
  date: string;
  map: string;
  kills: number;
  result: 'Выигран' | 'Проигран' | 'В процессе';
}

interface c4HistoryData {
  c4: {
    id: string;
    map: string;
    startedAt: Date | null;
    endedAt: Date | null;
    status: string;
    result: string;
  };
  killGain: number;
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Получаем полные данные пользователя с связанными сущностями
  const user = await prisma.user.findUnique({
    where: { id },
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
      techSlots: true
    }
  });

  if (!user) {
    return <div className="flex justify-center items-center h-64">Пользователь не найден</div>;
  }

  // Функция для форматирования больших чисел
  function formatLargeNumber(num: bigint | number | null | undefined): string {
    if (num === null || num === undefined) return '0';

    const numValue = typeof num === 'bigint' ? Number(num) : num;

    if (numValue >= 1000000000) {
      return (numValue / 1000000000).toFixed(1).replace('.', ',') + ' млрд';
    }
    if (numValue >= 1000000) {
      return (numValue / 1000000).toFixed(1).replace('.', ',') + ' млн';
    }
    if (numValue >= 1000) {
      return (numValue / 1000).toFixed(1).replace('.', ',') + ' тыс';
    }

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

  let playerStats = null;
  let c4HistoryData: c4HistoryData[] = [];

  if (user.player) {
    playerStats = {
      power: user.player.power,
      kill: user.player.kill,
      die: user.player.die,
      kd: user.player.kd,
      resourceCollection: user.player.resourceCollection,
      techPower: user.player.techPower,
      airPower: user.player.airPower,
      navyPower: user.player.navyPower,
      groundPower: user.player.groundPower,
    };

    c4HistoryData = user.player.c4Stats as c4HistoryData[];
  }

  // Преобразуем данные для истории сражений
  const c4History: C4Data[] = c4HistoryData.map((stat) => {
    const startDate = stat.c4.startedAt ? new Date(stat.c4.startedAt).toLocaleDateString('ru-RU') : 'Неизвестно';
    const endDate = stat.c4.endedAt ? new Date(stat.c4.endedAt).toLocaleDateString('ru-RU') : 'Неизвестно';

    let result: 'Выигран' | 'Проигран' | 'В процессе';
    if (stat.c4.status === 'active' || stat.c4.result === 'In process') {
      result = 'В процессе';
    } else {
      result = stat.c4.result === 'win' ? 'Выигран' : 'Проигран';
    }

    return {
      id: stat.c4.id,
      date: `${startDate} - ${endDate}`,
      map: getMapValue(stat.c4.map),
      kills: stat.killGain || 0,
      result: result
    };
  });

  const avatarImage = `https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userProfile/${user.id}.png`;
  const fallbackAvatar = "/source/help/profile.png";

  return (
    <div className='flex flex-col p-0 md:p-6 max-w-full overflow-x-hidden'>
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Профиль пользователя</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex-row items-center gap-4">
            <Avatar className="mt-2 h-10 w-10 md:h-12 md:w-12">
              <Image
                className="rounded-full object-cover border-2 border-gray-300"
                src={avatarImage}
                alt={user.username || 'User Avatar'}
                width={128}
                height={128}
              />
              <AvatarFallback>
                <Image
                  className="rounded-full object-cover border-2 border-gray-300"
                  src={fallbackAvatar}
                  alt={user.username || 'User Avatar'}
                  width={128}
                  height={128}
                />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg md:text-xl leading-tight">{user.username}</CardTitle>
              <CardDescription className="select-none text-sm md:text-base">
                {user.gameID || 'Не привязан'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-xl text-xs md:text-sm">Альянс: ST</Badge>
              <Badge className="rounded-xl text-xs md:text-sm" variant="default">{user.role}</Badge>
              <Badge
                className="rounded-xl text-xs md:text-sm"
                variant={user.rank as "default" | "secondary" | "destructive" | "outline" | "R1" | "R2" | "R3" | "R4" | "leader" | "officer"}
              >
                {user.rank}
              </Badge>
            </div>
            <div className="grid grid-cols-3 h-full gap-2 text-sm">
              <div className="flex flex-col items-start">
                {user.techSlots
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
                {user.techSlots
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
                {user.techSlots
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

        {/* Карточка с основной статистикой */}
        {playerStats && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Основная статистика</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Общая мощность</span>
                <span className="font-medium">{formatLargeNumber(playerStats.power)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">K/D</span>
                <span className="font-medium">{playerStats.kd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Убийства</span>
                <span className="font-medium">{formatLargeNumber(playerStats.kill)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Смерти</span>
                <span className="font-medium">{formatLargeNumber(playerStats.die)}</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Карточка с дополнительной статистикой */}
        {playerStats && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Дополнительная статистика</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Сбор ресурсов</span>
                <span className="font-medium">{formatLargeNumber(playerStats.resourceCollection)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Технологии</span>
                <span className="font-medium">{formatLargeNumber(playerStats.techPower)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Наземные силы</span>
                <span className="font-medium">{formatLargeNumber(playerStats.groundPower)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Воздушные силы</span>
                <span className="font-medium">{formatLargeNumber(playerStats.airPower)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Военно-морские силы</span>
                <span className="font-medium">{formatLargeNumber(playerStats.navyPower)}</span>
              </div>
            </CardContent>
          </Card>
        )}
        
      </div>
      {playerStats && (
        <Card className="mt-4 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Распределение сил</CardTitle>
          </CardHeader>
          <CardContent>

            {/* Визуализация сил - один прогресс-бар с тремя сегментами */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-2">
                  
                  <span className="font-medium">
                    {formatLargeNumber(playerStats.groundPower)} /{" "}
                    {formatLargeNumber(playerStats.airPower)} /{" "}
                    {formatLargeNumber(playerStats.navyPower)}
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
                            width: `${percentages.air}%`,
                          }}
                        />

                        {/* ВМС - голубой */}
                        <div
                          className="absolute top-0 h-full bg-cyan-500"
                          style={{
                            left: `${percentages.ground + percentages.air}%`,
                            width: `${percentages.navy}%`,
                          }}
                        />
                      </>
                    );
                  })()}
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                    Земля:{" "}
                    {
                      calculateForcePercentages(
                        playerStats.groundPower || 0,
                        playerStats.airPower || 0,
                        playerStats.navyPower || 0
                      ).ground
                    }
                    %
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                    Воздух:{" "}
                    {
                      calculateForcePercentages(
                        playerStats.groundPower || 0,
                        playerStats.airPower || 0,
                        playerStats.navyPower || 0
                      ).air
                    }
                    %
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-cyan-500 rounded mr-1"></div>
                    Вода:{" "}
                    {
                      calculateForcePercentages(
                        playerStats.groundPower || 0,
                        playerStats.airPower || 0,
                        playerStats.navyPower || 0
                      ).navy
                    }
                    %
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
                {c4History.map((c4, i) => {
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
                            href={`/c4/${c4.id}`}
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
                          <Link href={`/c4/${c4.id}`}>
                            {c4.map}
                          </Link>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {isInProgress ? (
                          c4.kills
                        ) : (
                          <Link href={`/c4/${c4.id}`}>
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
                          <Link href={`/c4/${c4.id}`}>
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

          <div className="md:hidden space-y-4">
            {c4History.map((c4, i) => {
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
                        <Link href={`/c4/${c4.id}`}>
                          {c4.map}
                        </Link>
                      )}
                    </div>

                    <div>
                      <div className="font-medium text-muted-foreground">Убийства</div>
                      {isInProgress ? c4.kills : (
                        <Link href={`/c4/${c4.id}`}>
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
                        <Link href={`/c4/${c4.id}`}>
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
