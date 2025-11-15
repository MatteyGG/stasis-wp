import { WarpathPlayer } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  TableBody,
  TableHead,
  TableCell,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { getMapValue } from "@/constants/maps";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { C4 } from "@prisma/client";

interface C4Data {
  id: string;
  date: string;
  map: string;
  kills: number;
  result: "Выигран" | "Проигран" | "В процессе";
}

interface c4HistoryData {
  c4?: C4;
  id: string;
  map: string;
  status: string;
  startedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
  result: string | null;
  avgPowerGain: number | null;
  avgKillGain: number | null;
  avgDieGain: number | null;
  avgKdGain: number | null;
  avgResourceGain: number | null;
  totalPlayers: number | null;
  statistics?: WarpathPlayer[];
}
export default async function C4page() {

    let c4HistoryData: c4HistoryData[] = [];

    c4HistoryData = await prisma.c4.findMany({
      orderBy: { createdAt: "desc" },

    });

const c4History: C4Data[] = c4HistoryData.map((current) => ({
  id: current.id,
  date: `${current.startedAt?.toLocaleDateString("ru-RU") ?? "Неизвестно"} - ${current.endedAt?.toLocaleDateString("ru-RU") ?? "Неизвестно"}`,
  map: getMapValue(current.map),
  kills: current.avgKillGain || 0,
  result: current.result === "win" ? "Выигран" : current.result === "In process" ? "В процессе" : "Проигран",
}));

  //   if (!c4 || c4.statistics.length === 0) {
  //     notFound();
  //   }
  return (
    <div className="mx-auto flex flex-wrap p-4 rounded-xl">
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">История сражений</h1>
      </div> */}
      {/* <Card className="w-full md:flex gap-4 p-4">
        <AllyWidget />
        <p className=" md:w-1/4 text-pretty mb-2 mt-2">Эта священная летопись хранит память о героических сражениях и великих завоеваниях Альянса Стазис. В её страницах запечатлены не только победы, но и уроки поражений, каждый из которых сделал нас сильнее.</p>
          
      </Card> */}

      <Card className="mt-4 rounded-2xl w-full">
        <CardHeader>
          <CardTitle className="text-base">История сражений</CardTitle>
            </CardHeader>
        <CardContent>
          {/* Десктопная версия (таблица) */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="text-left text-sm">
                  <TableHead className="px-4 py-3">Дата</TableHead>
                  <TableHead className="px-4 py-3">Карта</TableHead>
                  <TableHead className="px-4 py-3">Прирост  силы</TableHead>
                  <TableHead className="px-4 py-3">Результат</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {c4History.map((c4, i) => {
                  const [startDate, endDate] = c4.date.split(" - ");
                  const isInProgress = c4.result === "В процессе";

                  return (
                    <TableRow key={i} className="hover:bg-gray-100 text-sm">
                      <TableCell className="px-4 py-3">
                        {isInProgress ? (
                          <div className="flex flex-col">
                            <span>{startDate}</span>
                            <span className="text-xs text-muted-foreground">
                              до {endDate}
                            </span>
                          </div>
                        ) : (
                          <Link href={`/c4/${c4.id}`} className="flex flex-col">
                            <span>{startDate}</span>
                            <span className="text-xs text-muted-foreground">
                              до {endDate}
                            </span>
                          </Link>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {isInProgress ? (
                          c4.map
                        ) : (
                          <Link href={`/c4/${c4.id}`}>{c4.map}</Link>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {isInProgress ? (
                          c4.kills
                        ) : (
                          <Link href={`/c4/${c4.id}`}>{c4.kills}</Link>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {isInProgress ? (
                          <Badge className="rounded-xl" variant="outline">
                            {c4.result}
                          </Badge>
                        ) : (
                          <Link href={`/c4/${c4.id}`}>
                            <Badge
                              className="rounded-xl"
                              variant={
                                c4.result === "Выигран"
                                  ? "default"
                                  : "secondary"
                              }
                            >
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
            {c4History.map((c4, i) => {
              const [startDate, endDate] = c4.date.split(" - ");
              const isInProgress = c4.result === "В процессе";

              return (
                <Card key={i} className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="col-span-2">
                      <div className="font-medium text-muted-foreground">
                        Дата
                      </div>
                      <div>
                        <span>{startDate}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          - {endDate}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-muted-foreground">
                        Карта
                      </div>
                      {isInProgress ? (
                        c4.map
                      ) : (
                        <Link href={`/c4/${c4.id}`}>{c4.map}</Link>
                      )}
                    </div>

                    <div>
                      <div className="font-medium text-muted-foreground">
                        Убийства
                      </div>
                      {isInProgress ? (
                        c4.kills
                      ) : (
                        <Link href={`/c4/${c4.id}`}>{c4.kills}</Link>
                      )}
                    </div>

                    <div className="col-span-2">
                      <div className="font-medium text-muted-foreground">
                        Результат
                      </div>
                      <Badge
                        className="rounded-xl mt-1"
                        variant={
                          isInProgress
                            ? "outline"
                            : c4.result === "Выигран"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {c4.result}
                      </Badge>
                    </div>

                    {!isInProgress && (
                      <div className="col-span-2 text-right">
                        <Link href={`/c4/${c4.id}`}>
                          <Button variant="outline" className="rounded-xl">
                            Подробнее
                          </Button>
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
