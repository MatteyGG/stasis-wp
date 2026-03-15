import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { addDays, formatDay, getV1AllianceActions, getV1AllianceProfile, getV1AllianceRoster, getV1AllianceTransfers, getV1Players } from "@/lib/warpath-stats";
import { formatInt } from "@/lib/formatInt";

type PageProps = {
  params: Promise<{ wid: string; gid: string }>;
};

function toInt(v: string | undefined): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}

export default async function AllianceProfilePage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) return <div className="p-6 text-sm text-slate-600">Требуется авторизация.</div>;

  const { wid: widRaw, gid: gidRaw } = await params;
  const wid = toInt(widRaw);
  const gid = toInt(gidRaw);
  if (!wid || !gid) notFound();

  const profile = await getV1AllianceProfile(wid, gid);
  const alliance = profile.data.alliance;
  const toDay = alliance.lastDayInt;
  const fromDay = addDays(toDay, -14);

  const [transfers, actions, roster, playersForTags] = await Promise.all([
    getV1AllianceTransfers(wid, gid, fromDay, toDay),
    getV1AllianceActions(wid, gid, fromDay, toDay),
    getV1AllianceRoster(wid, gid, 1, 100),
    getV1Players(wid, { page: 1, pageSize: 500, sort: "power:desc", window: "7d" }),
  ]);
  const fallbackTag = playersForTags.data.find((p) => p.currentAlliance.gid === String(gid))?.currentAlliance.gnick ?? null;
  const tag = alliance.gnick ?? fallbackTag ?? "NO TAG";

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Альянс [{tag}]</h1>
        <Link href={`/statistics/alliances?wid=${wid}`} className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">
          К списку альянсов
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Текущее состояние</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="rounded bg-slate-100 p-3">
            <p className="text-xs text-slate-500">Сила</p>
            <p className="font-bold">{formatInt(alliance.current.power)}</p>
          </div>
          <div className="rounded bg-slate-100 p-3">
            <p className="text-xs text-slate-500">Килы</p>
            <p className="font-bold">{formatInt(alliance.current.kil)}</p>
          </div>
          <div className="rounded bg-slate-100 p-3">
            <p className="text-xs text-slate-500">Потери</p>
            <p className="font-bold">{formatInt(alliance.current.di)}</p>
          </div>
          <div className="rounded bg-slate-100 p-3">
            <p className="text-xs text-slate-500">Участники</p>
            <p className="font-bold">{formatInt(alliance.current.memberCount)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Изменение за 7 дней</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          <p className="text-sm">Сила: {formatInt(alliance.delta.d7?.power.abs ?? "0")}</p>
          <p className="text-sm">Килы: {formatInt(alliance.delta.d7?.kil.abs ?? "0")}</p>
          <p className="text-sm">Потери: {formatInt(alliance.delta.d7?.di.abs ?? "0")}</p>
          <p className="text-sm">Участники: {formatInt(alliance.delta.d7?.members.abs ?? "0")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>События переходов (14 дней)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {transfers.data.events.length === 0 && <p className="text-sm text-slate-500">Нет событий в окне.</p>}
          {transfers.data.events.map((e, idx) => (
            <p key={`${e.dayInt}-${idx}`} className="text-sm text-slate-700">
              {formatDay(e.dayInt)}: <Link className="text-blue-700 hover:underline" href={`/statistics/player/${wid}/${e.pid}`}>{e.nick}</Link> {e.type === "in" ? "вошёл" : "вышел"} ({e.fromGnick ?? "-"} → {e.toGnick ?? "-"})
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Действия альянса (14 дней)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {actions.data.actions.length === 0 && <p className="text-sm text-slate-500">Нет событий в окне.</p>}
          {actions.data.actions.map((a, idx) => {
            const details =
              a.from !== undefined || a.to !== undefined
                ? ` ${String(a.from ?? "-")} → ${String(a.to ?? "-")}`
                : a.delta !== undefined
                  ? ` ${formatInt(String(a.delta))}`
                  : "";
            return (
              <p key={`${a.dayInt}-${idx}`} className="text-sm text-slate-700">
                {formatDay(a.dayInt)}: {a.title}{details}
              </p>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Участники (последняя дата)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-xs text-slate-500">Дата: {formatDay(toDay)} • показано: {roster.data.length}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2">Игрок</th>
                  <th className="py-2">Lvl</th>
                  <th className="py-2">Сила</th>
                  <th className="py-2">Килы</th>
                  <th className="py-2">Потери</th>
                  <th className="py-2">ΔСила 7д</th>
                  <th className="py-2">ΔКилы 7д</th>
                </tr>
              </thead>
              <tbody>
                {roster.data.map((m) => (
                  <tr key={m.pid} className="border-b border-slate-100">
                    <td className="py-2">
                      <Link className="text-blue-700 hover:underline" href={`/statistics/player/${wid}/${m.pid}`}>
                        {m.nick}
                      </Link>
                    </td>
                    <td className="py-2">{m.level ?? "-"}</td>
                    <td className="py-2">{formatInt(m.power)}</td>
                    <td className="py-2">{formatInt(m.sumkill)}</td>
                    <td className="py-2">{formatInt(m.die)}</td>
                    <td className="py-2">{formatInt(m.dPower7d)}</td>
                    <td className="py-2">{formatInt(m.dSumkill7d)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
