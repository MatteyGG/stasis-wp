"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDay, type WorldAllianceCityHeatmap } from "@/lib/warpath-stats";

type AllianceOption = { gid: number; label: string };

type Props = {
  wid: number;
  data: WorldAllianceCityHeatmap;
  options: AllianceOption[];
  selectedGids: number[];
};

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function cityPos(ccid: number) {
  const h1 = hashCode(`x-${ccid}`);
  const h2 = hashCode(`y-${ccid}`);
  return {
    x: 70 + (h1 % 760),
    y: 40 + (h2 % 330),
  };
}

export default function AllianceCityHeatmap({ wid, data, options, selectedGids }: Props) {
  const router = useRouter();
  const [pickedGids, setPickedGids] = useState<number[]>(selectedGids);
  const [fromDay, setFromDay] = useState<number>(data.fromDayInt);
  const [toDay, setToDay] = useState<number>(data.toDayInt);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pickStep, setPickStep] = useState<1 | 2>(1);

  const cityPoint = useMemo(() => {
    const m = new Map<number, { x: number; y: number }>();
    for (const c of data.cities) m.set(c.ccid, cityPos(c.ccid));
    for (const t of data.transitions) {
      if (!m.has(t.fromCcid)) m.set(t.fromCcid, cityPos(t.fromCcid));
      if (!m.has(t.toCcid)) m.set(t.toCcid, cityPos(t.toCcid));
    }
    return m;
  }, [data]);

  const maxCity = Math.max(1, ...data.cities.map((c) => Math.max(c.fromCount, c.toCount)));
  const topTransitions = data.transitions.slice(0, 10);

  const apply = () => {
    const q = new URLSearchParams();
    q.set("heatGids", pickedGids.join(","));
    q.set("heatFrom", String(Math.min(fromDay, toDay)));
    q.set("heatTo", String(Math.max(fromDay, toDay)));
    router.replace(`/statistics/worlds/${wid}?${q.toString()}`);
  };

  const onPickDay = (d: number) => {
    if (pickStep === 1) {
      setFromDay(d);
      setToDay(d);
      setPickStep(2);
      return;
    }
    setToDay(d);
    setPickStep(1);
  };

  return (
    <div className="space-y-3">
      <div className="rounded border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm">
            <span className="font-semibold text-slate-900">dateFrom:</span>{" "}
            <span className="rounded bg-orange-100 px-2 py-0.5 text-orange-800">{formatDay(Math.min(fromDay, toDay))}</span>
            <span className="mx-2 font-semibold text-slate-700">dateTo:</span>
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-800">{formatDay(Math.max(fromDay, toDay))}</span>
          </div>
          <details className="group relative">
            <summary className="cursor-pointer rounded border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-100">
              Альянсы ({pickedGids.length})
            </summary>
            <div className="absolute right-0 z-20 mt-1 max-h-64 w-64 overflow-auto rounded border border-slate-300 bg-white p-2 shadow-lg">
              {options.map((o) => (
                <label key={o.gid} className="mb-1 flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={pickedGids.includes(o.gid)}
                    onChange={() =>
                      setPickedGids((prev) =>
                        prev.includes(o.gid) ? prev.filter((x) => x !== o.gid) : [...prev, o.gid]
                      )
                    }
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </details>
        </div>
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-600">
          <span>Выбор дат:</span>
          <span className="rounded bg-slate-200 px-2 py-0.5">
            {pickStep === 1 ? "1-й клик: dateFrom" : "2-й клик: dateTo"}
          </span>
          <button className="rounded bg-blue-600 px-2 py-1 text-white" onClick={apply}>
            Применить
          </button>
        </div>
        <div className="relative overflow-x-auto pb-2 pt-3">
          <div className="absolute left-0 right-0 top-[22px] h-[2px] bg-slate-300" />
          <div className="relative flex gap-1">
          {data.availableDays.map((d) => {
            const isFrom = d === fromDay;
            const isTo = d === toDay;
            return (
              <button
                key={d}
                className={`relative whitespace-nowrap rounded px-2 py-1 text-[11px] ${
                  isFrom && isTo
                    ? "bg-emerald-600 text-white"
                    : isFrom
                      ? "bg-orange-600 text-white"
                      : isTo
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-700 border border-slate-300"
                }`}
                onClick={() => onPickDay(d)}
              >
                <span className={`absolute left-1/2 top-[-7px] h-2 w-2 -translate-x-1/2 rounded-full ${isFrom || isTo ? "bg-slate-900" : "bg-slate-400"}`} />
                {formatDay(d)}
              </button>
            );
          })}
          </div>
        </div>
      </div>

      <div className="rounded border border-slate-200 bg-white p-2">
        <svg viewBox="0 0 900 420" className="h-[420px] w-full rounded bg-[linear-gradient(180deg,#e0f2fe,#f8fafc)]">
          <rect x="0" y="0" width="900" height="420" fill="none" stroke="#cbd5e1" />
          <ellipse cx="220" cy="210" rx="160" ry="95" fill="#dbeafe" opacity="0.35" />
          <ellipse cx="520" cy="180" rx="170" ry="90" fill="#dbeafe" opacity="0.35" />
          <ellipse cx="740" cy="240" rx="120" ry="75" fill="#dbeafe" opacity="0.35" />

          {data.transitions.map((t, idx) => {
            const a = cityPoint.get(t.fromCcid);
            const b = cityPoint.get(t.toCcid);
            if (!a || !b) return null;
            const w = Math.max(1, Math.min(8, Math.round((t.count / Math.max(1, data.totals.movedPlayers)) * 30)));
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            return (
              <g key={`${t.fromCcid}-${t.toCcid}-${idx}`}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={hoveredIdx === idx ? "#dc2626" : "#0ea5e9"}
                  strokeWidth={w}
                  strokeOpacity={hoveredIdx === idx ? 0.95 : 0.45}
                />
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="transparent"
                  strokeWidth={Math.max(10, w + 6)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                {t.count >= 2 && (
                  <text x={mx} y={my} fontSize="10" fill={hoveredIdx === idx ? "#991b1b" : "#0f172a"}>
                    {t.count}
                  </text>
                )}
              </g>
            );
          })}

          {data.cities.map((c) => {
            const p = cityPoint.get(c.ccid);
            if (!p) return null;
            const intensity = Math.max(c.fromCount, c.toCount) / maxCity;
            const r = 6 + Math.round(intensity * 12);
            return (
              <g key={c.ccid}>
                <circle cx={p.x} cy={p.y} r={r} fill={`rgba(249,115,22,${0.25 + intensity * 0.65})`} stroke="#9a3412" />
                <text x={p.x + r + 2} y={p.y - 2} fontSize="11" fill="#0f172a">
                  {c.name ?? `City ${c.ccid}`}
                </text>
                <text x={p.x + r + 2} y={p.y + 11} fontSize="10" fill="#475569">
                  {c.fromCount} {"->"} {c.toCount}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {hoveredIdx !== null && data.transitions[hoveredIdx] && (
        <div className="rounded border border-rose-200 bg-rose-50 p-3">
          <p className="text-sm font-semibold text-rose-900">
            {data.transitions[hoveredIdx].fromName ?? `City ${data.transitions[hoveredIdx].fromCcid}`} {"->"}{" "}
            {data.transitions[hoveredIdx].toName ?? `City ${data.transitions[hoveredIdx].toCcid}`} ({data.transitions[hoveredIdx].count})
          </p>
          <div className="mt-1 grid grid-cols-1 gap-1 md:grid-cols-2">
            {data.transitions[hoveredIdx].players.map((p) => (
              <Link key={p.pid} className="text-xs text-blue-700 hover:underline" href={`/statistics/player/${wid}/${p.pid}`}>
                {p.nick ?? `PID ${p.pid}`} (#{p.pid})
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="rounded border border-slate-200 bg-white p-3">
        <p className="mb-2 text-sm font-semibold text-slate-800">Топ переходов</p>
        {topTransitions.length === 0 && <p className="text-xs text-slate-500">Нет переходов в выбранном диапазоне.</p>}
        {topTransitions.map((t, i) => (
          <button
            key={`${t.fromCcid}-${t.toCcid}-${i}`}
            className={`mb-1 block w-full rounded border px-2 py-1 text-left text-xs ${
              hoveredIdx === i ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50"
            }`}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {(t.fromName ?? `City ${t.fromCcid}`)} {"->"} {(t.toName ?? `City ${t.toCcid}`)}: {t.count}
          </button>
        ))}
      </div>
    </div>
  );
}
