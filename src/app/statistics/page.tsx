import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { formatDay, getTrackedPlayers, getV1Players, getV1Worlds } from "@/lib/warpath-stats";
import { formatInt } from "@/lib/formatInt";

export default async function StatisticsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="mx-auto max-w-3xl p-6 text-sm text-slate-600">Статистика доступна после авторизации.</div>;
  }

  const wid = 130;
  const [worlds, players, trackedPlayers] = await Promise.all([
    getV1Worlds(),
    getV1Players(wid, { page: 1, pageSize: 100, sort: "power:desc", window: "7d" }),
    getTrackedPlayers(),
  ]);
  const latestDay = worlds.data.find((w) => w.wid === wid)?.lastDayInt ?? players.data[0]?.lastDayInt ?? null;
  const trackedForWid = trackedPlayers.filter((p) => p.wid === wid);

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Топ сервера {wid}</h1>
        <div className="flex gap-2">
          <Link href={`/statistics/worlds/${wid}`} className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Доска сервера
          </Link>
          <Link href={`/statistics/alliances?wid=${wid}`} className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Альянсы
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Лидерборд игроков</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-xs text-slate-500">Последняя дата данных: {latestDay ? formatDay(latestDay) : "n/a"}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2">#</th>
                  <th className="py-2">Игрок</th>
                  <th className="py-2">Альянс</th>
                  <th className="py-2">Сила</th>
                  <th className="py-2">ΔСила 7д</th>
                  <th className="py-2">Килы</th>
                  <th className="py-2">Счёт</th>
                  <th className="py-2">Профиль</th>
                </tr>
              </thead>
              <tbody>
                {players.data.map((p, idx) => (
                  <tr key={p.pid} className="border-b border-slate-100">
                    <td className="py-2">{idx + 1}</td>
                    <td className="py-2">{p.nick}</td>
                    <td className="py-2">
                      {p.currentAlliance.gid ? (
                        <Link className="text-blue-700 hover:underline" href={`/statistics/alliances/${wid}/${p.currentAlliance.gid}`}>
                          [{p.currentAlliance.gnick ?? "NO TAG"}]
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2">{formatInt(p.current.maxPower)}</td>
                    <td className="py-2">{formatInt(p.delta.d7?.power.abs ?? "0")}</td>
                    <td className="py-2">{formatInt(p.current.sumkill)}</td>
                    <td className="py-2">{formatInt(p.current.score)}</td>
                    <td className="py-2">
                      <Link className="text-blue-700 hover:underline" href={`/statistics/player/${wid}/${p.pid}`}>
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Отслеживаемые игроки (W{wid})</CardTitle>
        </CardHeader>
        <CardContent>
          {trackedForWid.length === 0 ? (
            <p className="text-sm text-slate-500">Пока нет отслеживаемых игроков для этого сервера.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {trackedForWid.map((p) => (
                <div key={`${p.wid}-${p.pid}`} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                  <p className="font-semibold">PID {p.pid}</p>
                  <p className="text-xs text-slate-500">{p.note ? p.note : "без заметки"}</p>
                  <Link href={`/statistics/player/${p.wid}/${p.pid}`} className="mt-2 inline-block text-blue-700 hover:underline">
                    Открыть профиль
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
