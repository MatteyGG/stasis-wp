"use client";

import { useMemo, useState } from "react";
import { formatDay } from "@/lib/warpath-stats";
import { formatInt } from "@/lib/formatInt";

type MetricKey = "maxpower" | "sumkill" | "score" | "gx" | "bz";

type Point = {
  day: number;
  maxpower: string;
  sumkill: string;
  score: string;
  gx: string;
  bz: string;
};

type Props = {
  points: Point[];
};

const METRICS: Array<{ key: MetricKey; label: string; color: string }> = [
  { key: "maxpower", label: "Истинная сила", color: "#2563eb" },
  { key: "sumkill", label: "Килы", color: "#dc2626" },
  { key: "score", label: "Очки", color: "#059669" },
  { key: "gx", label: "GX", color: "#d97706" },
  { key: "bz", label: "BZ", color: "#7c3aed" },
];

function toBig(v: string): bigint {
  try {
    return BigInt(v);
  } catch {
    return BigInt(0);
  }
}

function formatDelta(v: bigint): string {
  if (v === BigInt(0)) return "0";
  return `${v > BigInt(0) ? "+" : ""}${formatInt(v)}`;
}

export default function PlayerMetricsChart({ points }: Props) {
  const [metric, setMetric] = useState<MetricKey>("maxpower");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const width = 920;
  const height = 320;
  const padX = 36;
  const padY = 24;

  const { coords, min, max } = useMemo(() => {
    const values = points.map((p) => toBig(p[metric]));
    const minV = values.reduce((a, b) => (a < b ? a : b), values[0] ?? BigInt(0));
    const maxV = values.reduce((a, b) => (a > b ? a : b), values[0] ?? BigInt(0));
    const span = maxV - minV;
    const len = Math.max(1, points.length - 1);

    const mapped = points.map((p, i) => {
      const x = padX + (i * (width - padX * 2)) / len;
      const value = toBig(p[metric]);
      const ratio =
        span === BigInt(0)
          ? 0.5
          : Number(((value - minV) * BigInt(10000)) / span) / 10000;
      const y = height - padY - ratio * (height - padY * 2);
      return { x, y, value, day: p.day };
    });
    return { coords: mapped, min: minV, max: maxV };
  }, [metric, points]);

  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const active = hoverIndex !== null ? coords[hoverIndex] : null;
  const activeMeta = hoverIndex !== null ? points[hoverIndex] : null;
  const activePrev = hoverIndex !== null && hoverIndex > 0 ? toBig(points[hoverIndex - 1][metric]) : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`rounded px-3 py-1 text-xs font-semibold ${
              metric === m.key ? "text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            style={metric === m.key ? { backgroundColor: m.color } : undefined}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-2">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>min: {formatInt(min)}</span>
          <span>max: {formatInt(max)}</span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[280px] w-full">
          <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#cbd5e1" strokeWidth="1" />
          <path d={path} fill="none" stroke={METRICS.find((m) => m.key === metric)?.color ?? "#2563eb"} strokeWidth="2.5" />
          {coords.map((c, i) => (
            <circle
              key={`${c.day}-${i}`}
              cx={c.x}
              cy={c.y}
              r={hoverIndex === i ? 5 : 3}
              fill={METRICS.find((m) => m.key === metric)?.color ?? "#2563eb"}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <title>{`${formatDay(c.day)}: ${formatInt(c.value)}`}</title>
            </circle>
          ))}

          {active && activeMeta && (
            <g>
              <line x1={active.x} y1={padY} x2={active.x} y2={height - padY} stroke="#94a3b8" strokeDasharray="4 4" />
              <rect x={Math.min(width - 260, active.x + 10)} y={padY} width="250" height="58" rx="6" fill="#0f172a" opacity="0.92" />
              <text x={Math.min(width - 250, active.x + 20)} y={padY + 16} fill="#f8fafc" fontSize="12">
                {formatDay(activeMeta.day)}
              </text>
              <text x={Math.min(width - 250, active.x + 20)} y={padY + 31} fill="#f8fafc" fontSize="12">
                Значение: {formatInt(active.value)}
              </text>
              <text x={Math.min(width - 250, active.x + 20)} y={padY + 46} fill="#cbd5e1" fontSize="12">
                Δ к пред. дню: {activePrev === null ? "n/a" : formatDelta(active.value - activePrev)}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
