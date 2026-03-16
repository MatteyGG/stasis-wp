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
  const [dayPickMode, setDayPickMode] = useState<"from" | "to">("from");

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

  const apply = () => {
    const q = new URLSearchParams();
    q.set("heatGids", pickedGids.join(","));
    q.set("heatFrom", String(Math.min(fromDay, toDay)));
    q.set("heatTo", String(Math.max(fromDay, toDay)));
    router.replace(`/statistics/worlds/${wid}?${q.toString()}`);
  };

  return (
    <div className="space-y-3">
      <div className="rounded border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-sm font-semibold text-slate-800">Выбор альянсов</p>
        <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
          {options.map((o) => (
            <label key={o.gid} className="flex items-center gap-2 text-xs text-slate-700">
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
      </div>

      <div className="rounded border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-sm font-semibold text-slate-800">Гребенка дат</p>
        <div className="mb-2 flex gap-2 text-xs">
          <button
            className={`rounded px-2 py-1 ${dayPickMode === "from" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"}`}
            onClick={() => setDayPickMode("from")}
          >
            Выбираю FROM
          </button>
          <button
            className={`rounded px-2 py-1 ${dayPickMode === "to" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"}`}
            onClick={() => setDayPickMode("to")}
          >
            Выбираю TO
          </button>
          <button className="rounded bg-blue-600 px-2 py-1 text-white" onClick={apply}>
            Применить
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {data.availableDays.map((d) => {
            const isFrom = d === fromDay;
            const isTo = d === toDay;
            return (
              <button
                key={d}
                className={`whitespace-nowrap rounded px-2 py-1 text-xs ${
                  isFrom && isTo
                    ? "bg-emerald-600 text-white"
                    : isFrom
                      ? "bg-orange-600 text-white"
                      : isTo
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 text-slate-700"
                }`}
                onClick={() => (dayPickMode === "from" ? setFromDay(d) : setToDay(d))}
              >
                {formatDay(d)}
              </button>
            );
          })}
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
            return (
              <line
                key={`${t.fromCcid}-${t.toCcid}-${idx}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={hoveredIdx === idx ? "#dc2626" : "#0ea5e9"}
                strokeWidth={w}
                strokeOpacity={hoveredIdx === idx ? 0.95 : 0.45}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
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
    </div>
  );
}
