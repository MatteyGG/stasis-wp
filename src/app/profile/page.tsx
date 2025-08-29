import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ShareProfileButton from '@/components/profile/ShareProfileButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from '@/components/ui/button';
import NotificationButtons from '@/components/profile/NotificationButtons';
import PromocodeItem from '@/components/promocodes';
import Link from 'next/link';

interface C4Data {
  id: string;
  date: string;
  map: string;
  kills: number;
  result: 'Выигран' | 'Проигран';
}

export default async function ProfilePage() {
  const session = await auth();

  // Если пользователь не авторизован
  if (!session?.user) {
    redirect('/login');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/promocode`
  );
  const promocodes = await response.json();
  const sortedPromocodes = [...promocodes.data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const { user } = session;

  // Подготовка данных для таблицы
  const battleHistory: C4Data[] = [
    { id: 'c4_1', date: '20.02.2025 - 22.02.2025', map: 'BERLIN', kills: 20, result: 'Выигран' },
    { id: 'c4_2', date: '15.02.2025 - 17.02.2025', map: 'PARIS', kills: 25, result: 'Выигран' },
    { id: 'c4_3', date: '10.02.2025 - 12.02.2025', map: 'AMSTERDAM', kills: 30, result: 'Выигран' },
    { id: 'c4_4', date: '05.02.2025 - 07.02.2025', map: 'LONDON', kills: 15, result: 'Проигран' },
    { id: 'c4_5', date: '01.02.2025 - 03.02.2025', map: 'ROME', kills: 35, result: 'Выигран' },
  ];

  return (
    <div className='flex flex-col p-0 md:p-6 max-w-full overflow-x-hidden'>
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Профиль пользователя</h1>
        <ShareProfileButton userId={user.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex-row items-center gap-4">
            <Avatar className="h-10 w-10 md:h-12 md:w-12">
              <AvatarImage src="https://i.pravatar.cc/100?img=13" alt="avatar" />
              <AvatarFallback>WP</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg md:text-xl leading-tight">{user.username}</CardTitle>
              <CardDescription className="cursor-pointer select-none text-sm md:text-base">
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
            <div>
              <Label className="text-sm">Прогресс HQ 29 → 30</Label>
              <Progress value={62} className="h-2 mt-2" />
            </div>
            <div className="flex gap-3 text-sm">
              <p>Данные из игры</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Быстрый доступ</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <NotificationButtons userId={user.id} />
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

      {/* Универсальная таблица для всех устройств */}
      <Card className="mt-4 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">История сражений</CardTitle>
          <CardDescription>Последние 5 сражений</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-left text-xs md:text-sm">
                <TableHead>Дата</TableHead>
                <TableHead>Карта</TableHead>
                <TableHead>Убийства</TableHead>
                <TableHead>Результат</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {battleHistory.map((c4, i) => {
                // Разделяем дату на начало и конец
                const [startDate, endDate] = c4.date.split(' - ');

                return (
                  <TableRow key={i} className="hover:bg-gray-100 group relative">
                    <TableCell className="font-medium p-0">
                      <Link 
                        href={`/battle/${c4.id}`}
                        className="block p-4 md:py-4 md:px-6 w-full h-full"
                      >
                        <div className="flex flex-col md:block">
                          <span className="block md:inline">{startDate}</span>
                          <span className="hidden md:inline"> - </span>
                          <span className="text-xs md:hidden">—</span>
                          <span className="block md:inline">{endDate}</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="p-0">
                      <Link 
                        href={`/battle/${c4.id}`}
                        className="block p-4 md:py-4 md:px-6 w-full h-full"
                      >
                        {c4.map}
                      </Link>
                    </TableCell>
                    <TableCell className="p-0">
                      <Link 
                        href={`/battle/${c4.id}`}
                        className="block p-4 md:py-4 md:px-6 w-full h-full"
                      >
                        {c4.kills}
                      </Link>
                    </TableCell>
                    <TableCell className="p-0">
                      <Link 
                        href={`/battle/${c4.id}`}
                        className="block p-4 md:py-4 md:px-6 w-full h-full"
                      >
                        <Badge className="rounded-xl" variant={c4.result === "Выигран" ? "default" : "secondary"}>
                          {c4.result}
                        </Badge>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}