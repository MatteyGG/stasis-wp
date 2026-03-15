import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { addDays, formatDay, getV1AllianceActions, getV1Alliances, getV1AllianceTransfers, getV1Players } from "@/lib/warpath-stats";
import { formatInt } from "@/lib/formatInt";

type PageProps = {
  params: Promise<{ wid: string }>;
  searchParams: Promise<{ q?: string; pid?: string }>;
};

function toInt(v: string | undefined): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}

export default async function ServerDashboardPage({ params, searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) return <div className="p-6 text-sm text-slate-600">Требуется авторизация.</div>;

  const { wid: widRaw } = await params;
  const sp = await searchParams;
  const wid = toInt(widRaw);
  if (!wid) notFound();

  const q = typeof sp.q === "string" ? sp.q : "";
  const pidSearch = toInt(typeof sp.pid === "string" ? sp.pid : undefined);
  const [alliances, playersGrowth] = await Promise.all([
    getV1Alliances(wid, { page: 1, pageSize: 20, q, sort: "power:desc" }),
    getV1Players(wid, { page: 1, pageSize: 15, sort: "d_power:desc", window: "7d" }),
  ]);
  const playersForTags = await getV1Players(wid, { page: 1, pageSize: 500, sort: "power:desc", window: "7d" });
  const gnickByGid = new Map<string, string>();
  for (const p of playersForTags.data) {
    const gid = p.currentAlliance.gid;
    const gnick = p.currentAlliance.gnick;
    if (gid && gnick && !gnickByGid.has(gid)) gnickByGid.set(gid, gnick);
  }

  const top3 = alliances.data.filter((a) => Number(a.gid) > 0).slice(0, 3);
  const top3Display = top3.map((a) => ({
    ...a,
    displayTag: a.gnick ?? gnickByGid.get(String(a.gid)) ?? `A${a.gid}`,
  }));
  const latestDay = top3Display[0]?.lastDayInt ?? playersGrowth.data[0]?.lastDayInt ?? null;

  const feeds = await Promise.all(
    top3Display.map(async (a) => {
      const gid = Number(a.gid);
      const toDay = a.lastDayInt;
      const fromDay = addDays(toDay, -7);
      const [transferFeed, actionFeed] = await Promise.all([
        getV1AllianceTransfers(wid, gid, fromDay, toDay),
        getV1AllianceActions(wid, gid, fromDay, toDay),
      ]);
      return {
        gid,
        gnick: a.displayTag,
        events: transferFeed.data.events.slice(0, 4).map((e) => ({
          pid: e.pid,
          day: formatDay(e.dayInt),
          nick: e.nick,
          text: `${e.type === "in" ? "вошёл" : "вышел"} (${e.fromGnick ?? "-"} → ${e.toGnick ?? "-"})`,
        })),
        actions: actionFeed.data.actions.slice(0, 4).map((e) => ({
          day: formatDay(e.dayInt),
          text:
            e.from !== undefined || e.to !== undefined
              ? `${e.title}: ${String(e.from ?? "-")} → ${String(e.to ?? "-")}`
              : e.delta !== undefined
                ? `${e.title}: ${formatInt(String(e.delta))}`
                : e.title,
        })),
      };
    })
  );

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Сервер {wid}</h1>
        <Link href="/statistics" className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">
          К серверам
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Сводка сервера</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded bg-slate-100 p-3">
            <p className="text-xs text-slate-500">Последняя дата данных</p>
            <p className="text-lg font-bold">{latestDay ? formatDay(latestDay) : "n/a"}</p>
          </div>
          <div className="rounded bg-slate-100 p-3">
            <p className="text-xs text-slate-500">Альянсов в выборке</p>
            <p className="text-lg font-bold">{alliances.meta.total}</p>
          </div>
          <div className="rounded bg-slate-100 p-3">
            <p className="text-xs text-slate-500">Топ прироста силы (7д)</p>
            <p className="text-lg font-bold">{playersGrowth.data.length}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Поиск в дашборде</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-center gap-2">
            <input name="q" defaultValue={q} placeholder="Сокращение альянса" className="w-full max-w-sm rounded border border-slate-300 px-3 py-2 text-sm" />
            <input name="pid" defaultValue={pidSearch ?? ""} placeholder="ID игрока" className="w-full max-w-[180px] rounded border border-slate-300 px-3 py-2 text-sm" />
            <button className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">Найти</button>
            <Link href={`/statistics/alliances?wid=${wid}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              Список альянсов
            </Link>
            {pidSearch && (
              <Link href={`/statistics/player/${wid}/${pidSearch}`} className="rounded bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700">
                Открыть игрока #{pidSearch}
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Игроки с максимальным приростом силы (7д)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {playersGrowth.data.slice(0, 10).map((p) => (
            <div key={p.pid} className="flex items-center justify-between rounded border border-slate-200 p-2 text-sm">
              <div>
                <p className="font-semibold text-slate-900">{p.nick}</p>
                <p className="text-xs text-slate-500">[{p.currentAlliance.gnick ?? "-"}]</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-emerald-700">{formatInt(p.delta.d7?.power.abs ?? "0")}</p>
                <Link href={`/statistics/player/${wid}/${p.pid}`} className="text-xs text-blue-700 hover:underline">
                  Профиль игрока
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {top3Display.map((a) => (
          <Card key={a.gid}>
            <CardHeader>
              <CardTitle className="text-base">[{a.displayTag}]</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>Сила: {formatInt(a.current.power)}</p>
              <p>Килы: {formatInt(a.current.kil)}</p>
              <p>Потери: {formatInt(a.current.di)}</p>
              <p>Участники: {formatInt(a.current.memberCount)}</p>
              <Link href={`/statistics/alliances/${wid}/${a.gid}`} className="inline-block rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-900">
                Страница альянса
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>События топ-альянсов (7д)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {feeds.map((f) => (
            <div key={f.gid} className="rounded border border-slate-200 p-3">
              <p className="mb-1 text-sm font-semibold text-slate-800">[{f.gnick}]</p>
              {f.events.length === 0 && f.actions.length === 0 && <p className="text-xs text-slate-500">Нет событий за окно.</p>}
              {f.events.map((e, idx) => (
                <p key={`${f.gid}-e-${idx}`} className="text-xs text-slate-600">
                  {e.day}: <Link className="text-blue-700 hover:underline" href={`/statistics/player/${wid}/${e.pid}`}>{e.nick}</Link> {e.text}
                </p>
              ))}
              {f.actions.map((e, idx) => (
                <p key={`${f.gid}-a-${idx}`} className="text-xs text-slate-700">
                  {e.day}: {e.text}
                </p>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
