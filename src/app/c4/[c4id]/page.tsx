// src/app/c4/[c4id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { calculateMvpData } from "@/lib/mvpUtils";
import MvpCarousel from "@/components/mvpCards/MvpCarousel";
import { getMapValue } from "@/constants/maps";
import { Badge } from "@/components/ui/badge";

export default async function C4StatsPage(props: {
  params: Promise<{ c4id: string }>;
}) {
  const params = await props.params;
  console.log(params.c4id);

  // Получаем данные C4 и статистику
  const c4 = await prisma.c4.findUnique({
    where: { id: params.c4id },
    include: {
      statistics: {
        include: {
          player: true,
        },
        orderBy: [{ powerGain: "desc" }, { killGain: "desc" }],
      },
    },
  });

  if (!c4 || c4.statistics.length === 0) {
    notFound();
  }
  const statistics = Array.isArray(c4.statistics) ? c4.statistics : [];
  const mvpsData = calculateMvpData({ ...c4, statistics });
  // Форматируем даты
  const startedAt = c4.startedAt
    ? new Date(c4.startedAt).toLocaleString("ru-RU")
    : "Не начато";
  const endedAt = c4.endedAt
    ? new Date(c4.endedAt).toLocaleString("ru-RU")
    : "Не завершено";
  const duration =
    c4.endedAt && c4.startedAt
      ? `${(
          (new Date(c4.endedAt).getTime() - new Date(c4.startedAt).getTime()) /
          3600000
        ).toFixed(1)} часов`
      : "В процессе";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Хлебные крошки */}
      <nav className="mb-6">
        <Link href="/c4" className="text-blue-500 hover:text-blue-700">
          ← Назад
        </Link>
      </nav>

      {/* Заголовок */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            Статистика завоевания: {getMapValue(c4.map)}
          </h1>
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              c4.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {c4.status === "active" ? "Активно" : "Завершено"}
          </span>
        </div>

        {/* Общая информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600 text-sm">Начато</p>
            <p className="font-medium">{startedAt}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600 text-sm">Завершено</p>
            <p className="font-medium">{endedAt}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600 text-sm">Длительность</p>
            <p className="font-medium">{duration}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600 text-sm">Участников</p>
            <p className="font-medium">
              {c4.totalPlayers || c4.statistics.length}
            </p>
          </div>
        </div>

        {/* Агрегированная статистика */}
        {c4.status === "finished" && (
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-lg font-semibold mb-3 text-blue-800">
              Общая статистика
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-blue-600 text-sm">Средний прирост силы</p>
                <p className="font-medium text-blue-800">
                  {c4.avgPowerGain
                    ? Math.round(c4.avgPowerGain).toLocaleString()
                    : 0}
                </p>
              </div>
              <div>
                <p className="text-blue-600 text-sm">Средний прирост убийств</p>
                <p className="font-medium text-blue-800">
                  {c4.avgKillGain ? Math.round(c4.avgKillGain) : 0}
                </p>
              </div>
              <div>
                <p className="text-blue-600 text-sm">Средний прирост смертей</p>
                <p className="font-medium text-blue-800">
                  {c4.avgDieGain ? Math.round(c4.avgDieGain) : 0}
                </p>
              </div>
              <div>
                <p className="text-blue-600 text-sm">Средний прирост K/D</p>
                <p className="font-medium text-blue-800">
                  {c4.avgKdGain ? c4.avgKdGain.toFixed(2) : 0}
                </p>
              </div>
            </div>
          </div>
        )}
        <MvpCarousel
          mvps={mvpsData}
          c4Id={c4.id}
          c4Map={c4.map}
          showLink={false}
        />
      </div>

      {/* Таблица статистики игроков */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">
          Статистика игроков
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Игрок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Начальная сила
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Прирост силы
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Прирост убийств
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Прирост смертей
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Прирост K/D
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {c4.statistics.map((stat, index) => (
                <tr
                  key={stat.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {/* Альянс или ID */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <Badge
                            className="rounded-xl text-xs md:text-sm"
                            variant={"outline"}
                          >
                            {stat.player?.ally || `ID: ${stat.warpathId}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Имя пользователя */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-900">
                    <Badge
                      className="rounded-xl text-xs md:text-sm"
                      variant={"outline"}
                    >
                      {stat.player?.username ||
                        stat.username ||
                        `Игрок ${stat.warpathId}`}
                    </Badge>
                  </td>

                  {/* Начальная сила */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.startPower.toLocaleString()}
                  </td>

                  {/* Прирост силы */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-medium ${
                        (stat.powerGain || 0) > 0
                          ? "text-green-600"
                          : (stat.powerGain || 0) < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {stat.powerGain !== null && stat.powerGain !== undefined
                        ? (stat.powerGain > 0 ? "+" : "") +
                          stat.powerGain.toLocaleString()
                        : "0"}
                    </span>
                  </td>

                  {/* Прирост убийств */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-medium ${
                        (stat.killGain || 0) > 0
                          ? "text-green-600"
                          : (stat.killGain || 0) < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {stat.killGain !== null && stat.killGain !== undefined
                        ? (stat.killGain > 0 ? "+" : "") + stat.killGain
                        : "0"}
                    </span>
                  </td>

                  {/* Прирост смертей */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-medium ${
                        (stat.dieGain || 0) > 0
                          ? "text-red-600"
                          : (stat.dieGain || 0) < 0
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {stat.dieGain !== null && stat.dieGain !== undefined
                        ? (stat.dieGain > 0 ? "+" : "") + stat.dieGain
                        : "0"}
                    </span>
                  </td>

                  {/* Прирост K/D */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-medium ${
                        (stat.kdGain || 0) > 0
                          ? "text-green-600"
                          : (stat.kdGain || 0) < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {stat.kdGain !== null && stat.kdGain !== undefined
                        ? (stat.kdGain > 0 ? "+" : "") + stat.kdGain.toFixed(2)
                        : "0.00"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {c4.statistics.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Нет данных статистики для этого события C4
          </div>
        )}
      </div>
    </div>
  );
}
