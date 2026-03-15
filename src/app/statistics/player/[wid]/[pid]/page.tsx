import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLargeNumber } from "@/lib/formatLargeNumber";
import { auth } from "@/lib/auth";
import PlayerMetricsChart from "@/components/statistics/player-metrics-chart";
import {
  addDays,
  dateToDayInt,
  formatDay,
  getCityTrend,
  getPlayerDataset,
  getWorldMode,
  parseBigIntString,
} from "@/lib/warpath-stats";

type PageProps = {
  params: Promise<{ wid: string; pid: string }>;
  searchParams: Promise<{ from?: string; to?: string; window?: string }>;
};

type EventItem = {
  day: number;
  type: "join" | "leave" | "switch" | "city_switch" | "inactive";
  text: string;
};

function toInt(v: string | undefined): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}

function dayIntToInputDate(dayInt: number): string {
  const s = String(dayInt);
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

function inputDateToDayInt(v: string | undefined): number | null {
  if (!v) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
  if (!m) return null;
  return Number(`${m[1]}${m[2]}${m[3]}`);
}

function kd(kills: bigint, die: bigint): number | null {
  if (die === BigInt(0)) return null;
  return Number((kills * BigInt(100)) / die) / 100;
}

export default async function PlayerProfilePage({ params, searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-6 text-sm text-slate-600">Требуется авторизация.</div>;
  }

  const { wid: widRaw, pid: pidRaw } = await params;
  const sp = await searchParams;
  const wid = toInt(widRaw);
  const pid = toInt(pidRaw);
  if (!wid || !pid) notFound();

  const today = dateToDayInt(new Date());
  const full = await getPlayerDataset(wid, pid, 20000101, today);
  if (!full.series.length) {
    return <div className="p-6 text-sm text-slate-600">Нет данных за выбранный диапазон.</div>;
  }
  const absoluteFirstDay = full.series[0].day;
  const absoluteLastDay = full.series[full.series.length - 1].day;
  const window = sp.window === "7d" || sp.window === "30d" || sp.window === "3m" ? sp.window : "30d";
  const reqTo = toInt(sp.to) ?? inputDateToDayInt(typeof sp.to === "string" ? sp.to : undefined) ?? absoluteLastDay;
  const fromByWindow = window === "7d" ? addDays(reqTo, -7) : window === "3m" ? addDays(reqTo, -90) : addDays(reqTo, -30);
  const reqFrom = toInt(sp.from) ?? inputDateToDayInt(typeof sp.from === "string" ? sp.from : undefined) ?? fromByWindow;
  const safeFrom = Math.min(reqFrom, reqTo);
  const safeTo = Math.max(reqFrom, reqTo);
  const clampedFrom = Math.max(safeFrom, absoluteFirstDay);
  const clampedTo = Math.min(safeTo, absoluteLastDay);
  if (clampedFrom > clampedTo) {
    return (
      <div className="p-6 text-sm text-slate-600">
        Нет данных в этом диапазоне. Доступно: {formatDay(absoluteFirstDay)} - {formatDay(absoluteLastDay)}.
      </div>
    );
  }

  const [dataset, mode] = await Promise.all([getPlayerDataset(wid, pid, clampedFrom, clampedTo), getWorldMode(wid)]);
  if (!dataset.series.length) {
    return <div className="p-6 text-sm text-slate-600">Нет данных за выбранный диапазон.</div>;
  }

  const series = dataset.series.map((x) => ({
    day: x.day,
    gnick: x.gnick ?? null,
    nick: x.nick ?? "Unknown",
    lv: x.lv ?? null,
    cid: x.cid ?? null,
    ccid: x.ccid ?? null,
    power: parseBigIntString(x.power),
    maxpower: parseBigIntString(x.maxpower),
    sumkill: parseBigIntString(x.sumkill),
    die: parseBigIntString(x.die),
    score: parseBigIntString(x.score),
    caiji: parseBigIntString(x.caiji),
    gx: parseBigIntString(x.allianceTechContribution),
    bz: parseBigIntString(x.allianceHelp),
  }));

  const first = series[0];
  const last = series[series.length - 1];
  const base7 = series.find((s) => s.day >= addDays(last.day, -7)) ?? first;

  const dTruePower7 = last.maxpower - base7.maxpower;
  const dBoostPower7 = last.power - base7.power;
  const dKill7 = last.sumkill - base7.sumkill;
  const dDie7 = last.die - base7.die;
  const dScore7 = last.score - base7.score;
  const dGx7 = last.gx - base7.gx;
  const dBz7 = last.bz - base7.bz;

  const eff7 = kd(dKill7, dDie7);
  const playerKd = kd(last.sumkill, last.die);

  const cityIds = Array.from(new Set(series.map((s) => s.ccid).filter((v): v is number => typeof v === "number")));
  const cityMap = new Map<number, string>();
  await Promise.all(
    cityIds.map(async (ccid) => {
      try {
        const trend = await getCityTrend(wid, ccid, addDays(last.day, -3), last.day);
        cityMap.set(ccid, trend.name ?? `Unknown city (${ccid})`);
      } catch {
        cityMap.set(ccid, `Unknown city (${ccid})`);
      }
    })
  );
  const cityName = last.ccid ? cityMap.get(last.ccid) ?? `Unknown city (${last.ccid})` : "n/a";

  const events: EventItem[] = [];
  let prevAlliance: string | null = null;
  let prevCity: number | null = null;
  for (const point of series) {
    const curAlliance = point.gnick ?? null;
    const curCity = point.ccid ?? null;
    if (prevAlliance === null && curAlliance !== null) {
      events.push({ day: point.day, type: "join", text: `Вступил в альянс [${curAlliance}]` });
    } else if (prevAlliance !== null && curAlliance === null) {
      events.push({ day: point.day, type: "leave", text: `Покинул альянс [${prevAlliance}]` });
    } else if (prevAlliance !== null && curAlliance !== null && prevAlliance !== curAlliance) {
      events.push({ day: point.day, type: "switch", text: `Смена альянса: [${prevAlliance}] → [${curAlliance}]` });
    }

    if (prevCity !== null && curCity !== null && prevCity !== curCity) {
      events.push({
        day: point.day,
        type: "city_switch",
        text: `Смена города: ${cityMap.get(prevCity) ?? prevCity} → ${cityMap.get(curCity) ?? curCity}`,
      });
    }
    prevAlliance = curAlliance;
    prevCity = curCity;
  }

  let inactiveDays = 0;
  for (let i = series.length - 1; i > 0; i -= 1) {
    const cur = series[i];
    const prev = series[i - 1];
    const dGx = cur.gx - prev.gx;
    const dBz = cur.bz - prev.bz;
    if (dGx <= BigInt(0) && dBz <= BigInt(0)) {
      inactiveDays += 1;
      continue;
    }
    break;
  }
  if (inactiveDays > 0) {
    events.push({
      day: last.day,
      type: "inactive",
      text: `Неактивен ${inactiveDays} дн. (нет прироста GX и BZ)`,
    });
  }
  events.sort((a, b) => b.day - a.day);

  return (
    <div className="mx-auto w-full max-w-[1400px] p-3 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-4xl">
            Игрок {last.nick} <span className="text-gray-500">#{pid}</span>
          </h1>
          <p className="text-sm text-gray-600">
            Диапазон: {formatDay(first.day)} - {formatDay(last.day)} • точек: {series.length}
          </p>
          <form className="mt-2 flex flex-wrap items-end gap-2">
            <label className="text-xs text-slate-600">
              From
              <input
                type="date"
                name="from"
                defaultValue={dayIntToInputDate(clampedFrom)}
                className="ml-1 rounded border border-slate-300 px-2 py-1 text-xs"
              />
            </label>
            <label className="text-xs text-slate-600">
              To
              <input
                type="date"
                name="to"
                defaultValue={dayIntToInputDate(clampedTo)}
                className="ml-1 rounded border border-slate-300 px-2 py-1 text-xs"
              />
            </label>
            <button className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700">Применить</button>
          </form>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <Link href={`/statistics/player/${wid}/${pid}?window=7d&to=${absoluteLastDay}`} className={`rounded px-2 py-1 ${window === "7d" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}>7д</Link>
            <Link href={`/statistics/player/${wid}/${pid}?window=30d&to=${absoluteLastDay}`} className={`rounded px-2 py-1 ${window === "30d" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}>30д</Link>
            <Link href={`/statistics/player/${wid}/${pid}?window=3m&to=${absoluteLastDay}`} className={`rounded px-2 py-1 ${window === "3m" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}>3м</Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">[{last.gnick ?? "NO ALLY"}]</Badge>
          <Badge variant="outline">Lvl {last.lv ?? "?"}</Badge>
          <Link href={`/statistics/worlds/${wid}`} className="rounded-md bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300">
            К миру
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr_340px]">
        <aside className="space-y-4">
          <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600">Истинная сила (7д)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-slate-900">{dTruePower7 >= BigInt(0) ? "+" : ""}{formatLargeNumber(Number(dTruePower7))}</p>
              <p className="mt-1 text-xs text-slate-500">Считается по maxpower (без бустов +20/+40%).</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600">Боевая эффективность (7д)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-slate-900">{eff7 === null ? "n/a" : eff7.toFixed(2)}</p>
              <p className="mt-1 text-xs text-slate-500">Формула: Δkills(7д) / Δdeaths(7д). Это коэффициент, не процент.</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600">Мир/режим/город</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-slate-900">W{wid} • mode {mode.mode}</p>
              <p className="mt-1 text-xs text-slate-500">Текущий город: {cityName}</p>
            </CardContent>
          </Card>
        </aside>

        <main className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Центральная статистика (изменение за 7 дней)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-lg bg-slate-100 p-3">
                  <p className="text-xs text-slate-500">True Power (maxpower)</p>
                  <p className="text-lg font-bold">{formatLargeNumber(Number(last.maxpower))}</p>
                  <p className="text-xs text-slate-600">{dTruePower7 >= BigInt(0) ? "+" : ""}{formatLargeNumber(Number(dTruePower7))} / 7д</p>
                </div>
                <div className="rounded-lg bg-slate-100 p-3">
                  <p className="text-xs text-slate-500">Power (boosted)</p>
                  <p className="text-lg font-bold">{formatLargeNumber(Number(last.power))}</p>
                  <p className="text-xs text-slate-600">{dBoostPower7 >= BigInt(0) ? "+" : ""}{formatLargeNumber(Number(dBoostPower7))} / 7д</p>
                </div>
                <div className="rounded-lg bg-slate-100 p-3">
                  <p className="text-xs text-slate-500">Kills / Die (7д)</p>
                  <p className="text-lg font-bold">{formatLargeNumber(Number(dKill7))} / {formatLargeNumber(Number(dDie7))}</p>
                  <p className="text-xs text-slate-600">K/D total: {playerKd === null ? "n/a" : playerKd.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-slate-100 p-3">
                  <p className="text-xs text-slate-500">Score / GX / BZ (7д)</p>
                  <p className="text-lg font-bold">{formatLargeNumber(Number(dScore7))}</p>
                  <p className="text-xs text-slate-600">GX: {formatLargeNumber(Number(dGx7))}, BZ: {formatLargeNumber(Number(dBz7))}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Интерактивный график динамики</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PlayerMetricsChart
                points={series.map((s) => ({
                  day: s.day,
                  maxpower: s.maxpower.toString(),
                  sumkill: s.sumkill.toString(),
                  score: s.score.toString(),
                  gx: s.gx.toString(),
                  bz: s.bz.toString(),
                }))}
              />
            </CardContent>
          </Card>
        </main>

        <aside>
          <Card className="sticky top-4 border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Лента событий</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[70vh] space-y-3 overflow-auto pr-1">
                {events.length === 0 && <p className="text-sm text-slate-500">Событий не найдено в выбранном диапазоне.</p>}
                {events.map((e, i) => (
                  <div key={`${e.day}-${i}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">{formatDay(e.day)}</p>
                    <p className="text-sm font-semibold text-slate-800">{e.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
