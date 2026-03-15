"use client";

import { useEffect, useMemo, useState } from "react";

type OpsState = {
  loading: boolean;
  message: string;
  error: string;
};

type SurfacedAlliance = {
  gid: string;
  gnick?: string | null;
  current: { power: string; memberCount: number };
};

function todayDayInt() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return Number(`${y}${m}${d}`);
}

function shiftDay(dayInt: number, delta: number) {
  const s = String(dayInt);
  const dt = new Date(Date.UTC(Number(s.slice(0, 4)), Number(s.slice(4, 6)) - 1, Number(s.slice(6, 8))));
  dt.setUTCDate(dt.getUTCDate() + delta);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return Number(`${y}${m}${d}`);
}

async function postJson(body: unknown) {
  const res = await fetch("/api/admin/warpath-stats", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, data: text ? JSON.parse(text) : null };
  } catch {
    return { ok: res.ok, status: res.status, data: text };
  }
}

async function getOps(wid: number) {
  const res = await fetch(`/api/admin/warpath-stats?wid=${wid}`, { cache: "no-store" });
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export default function WarpathOps() {
  const today = useMemo(() => todayDayInt(), []);
  const [wid, setWid] = useState(130);
  const [dayInt, setDayInt] = useState(today);
  const [fromDayInt, setFromDayInt] = useState(shiftDay(today, -14));
  const [toDayInt, setToDayInt] = useState(today);
  const [status, setStatus] = useState<OpsState>({ loading: false, message: "", error: "" });
  const [health, setHealth] = useState<string>("checking...");
  const [alliances, setAlliances] = useState<SurfacedAlliance[]>([]);
  const [gnickByGid, setGnickByGid] = useState<Map<number, string>>(new Map());
  const [selected, setSelected] = useState<number[]>([]);
  const [trackPlayerWid, setTrackPlayerWid] = useState(130);
  const [trackPlayerPid, setTrackPlayerPid] = useState(0);
  const [trackPlayerNote, setTrackPlayerNote] = useState("");

  const refreshCatalog = async () => {
    try {
      const parsed = await getOps(wid);
      const ok = parsed?.health?.ok === true && parsed?.health?.body?.ok === true;
      setHealth(ok ? "online" : `error (${parsed?.health?.status ?? "?"})`);
      const items = (parsed?.surfacedAlliances?.body?.data ?? []) as SurfacedAlliance[];
      setAlliances(items.filter((a) => Number(a.gid) > 0));
      const players = (parsed?.surfacedPlayers?.body?.data ?? []) as Array<{ currentAlliance?: { gid?: string | null; gnick?: string | null } }>;
      const map = new Map<number, string>();
      for (const p of players) {
        const gid = Number(p?.currentAlliance?.gid ?? 0);
        const gnick = p?.currentAlliance?.gnick;
        if (gid > 0 && typeof gnick === "string" && gnick.trim().length > 0 && !map.has(gid)) {
          map.set(gid, gnick.trim());
        }
      }
      setGnickByGid(map);
      setSelected([]);
    } catch {
      setHealth("offline");
      setAlliances([]);
      setSelected([]);
    }
  };

  useEffect(() => {
    refreshCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wid]);

  const run = async (action: "syncLatest" | "refreshCities" | "serverScan" | "serverBackfill") => {
    setStatus({ loading: true, message: "", error: "" });
    const body =
      action === "serverScan"
        ? { action, wid, dayInt }
        : action === "serverBackfill"
          ? { action, wid, fromDayInt, toDayInt }
          : { action };
    const out = await postJson(body);
    if (!out.ok) {
      setStatus({ loading: false, message: "", error: `HTTP ${out.status}: ${JSON.stringify(out.data).slice(0, 280)}` });
      return;
    }
    setStatus({ loading: false, message: JSON.stringify(out.data).slice(0, 300), error: "" });
  };

  const trackSelected = async (withBackfill: boolean) => {
    if (selected.length === 0) {
      setStatus({ loading: false, message: "", error: "Выберите хотя бы один альянс" });
      return;
    }
    setStatus({ loading: true, message: "", error: "" });
    const trackRes = await postJson({ action: "trackAlliances", wid, gids: selected });
    if (!trackRes.ok) {
      setStatus({ loading: false, message: "", error: `Tracking error: ${JSON.stringify(trackRes.data).slice(0, 280)}` });
      return;
    }

    if (withBackfill) {
      const backfillRes = await postJson({ action: "serverBackfill", wid, fromDayInt, toDayInt });
      if (!backfillRes.ok) {
        setStatus({ loading: false, message: "", error: `Backfill error: ${JSON.stringify(backfillRes.data).slice(0, 280)}` });
        return;
      }
      setStatus({ loading: false, message: "Альянсы добавлены в tracking, backfill запущен.", error: "" });
      return;
    }

    setStatus({ loading: false, message: "Альянсы добавлены в tracking.", error: "" });
  };

  const toggleAlliance = (gid: number) => {
    setSelected((prev) => (prev.includes(gid) ? prev.filter((x) => x !== gid) : [...prev, gid]));
  };

  const trackPlayer = async () => {
    if (!Number.isInteger(trackPlayerWid) || !Number.isInteger(trackPlayerPid) || trackPlayerPid <= 0) {
      setStatus({ loading: false, message: "", error: "Укажите корректные wid и pid" });
      return;
    }
    setStatus({ loading: true, message: "", error: "" });
    const out = await postJson({
      action: "trackPlayer",
      wid: trackPlayerWid,
      pid: trackPlayerPid,
      note: trackPlayerNote.trim() || undefined,
    });
    if (!out.ok) {
      setStatus({ loading: false, message: "", error: `Track player error: ${JSON.stringify(out.data).slice(0, 280)}` });
      return;
    }
    setStatus({ loading: false, message: "Игрок добавлен в tracking. Запущен sync latest по его серверу.", error: "" });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Warpath Stats Ops</h2>
      <p className="text-sm text-slate-600">
        Статус подключения: <span className="font-semibold">{health}</span>
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1 block text-slate-600">wid</span>
          <input className="w-full rounded border border-slate-300 px-2 py-1" type="number" value={wid} onChange={(e) => setWid(Number(e.target.value) || 0)} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-slate-600">dayInt</span>
          <input className="w-full rounded border border-slate-300 px-2 py-1" type="number" value={dayInt} onChange={(e) => setDayInt(Number(e.target.value) || 0)} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-slate-600">fromDayInt</span>
          <input className="w-full rounded border border-slate-300 px-2 py-1" type="number" value={fromDayInt} onChange={(e) => setFromDayInt(Number(e.target.value) || 0)} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-slate-600">toDayInt</span>
          <input className="w-full rounded border border-slate-300 px-2 py-1" type="number" value={toDayInt} onChange={(e) => setToDayInt(Number(e.target.value) || 0)} />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="rounded bg-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60" disabled={status.loading} onClick={refreshCatalog}>
          Обновить список альянсов
        </button>
        <button className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60" disabled={status.loading} onClick={() => run("syncLatest")}>
          Sync Latest
        </button>
        <button className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={status.loading} onClick={() => run("serverScan")}>
          Server Scan (day)
        </button>
        <button className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60" disabled={status.loading} onClick={() => run("serverBackfill")}>
          Server Backfill
        </button>
        <button className="rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-60" disabled={status.loading} onClick={() => run("refreshCities")}>
          Refresh Cities
        </button>
      </div>

      <div className="rounded border border-slate-200 p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800">Засвеченные альянсы (мультивыбор)</p>
          <div className="flex gap-2">
            <button className="rounded bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-60" disabled={status.loading || selected.length === 0} onClick={() => trackSelected(false)}>
              Добавить в tracking
            </button>
            <button className="rounded bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60" disabled={status.loading || selected.length === 0} onClick={() => trackSelected(true)}>
              Добавить + Backfill
            </button>
          </div>
        </div>
        <p className="mb-2 text-xs text-slate-500">Выбрано: {selected.length}</p>
        <div className="max-h-72 space-y-1 overflow-auto pr-1">
          {alliances.length === 0 && <p className="text-xs text-slate-500">Список пуст, нажмите &quot;Обновить список альянсов&quot;.</p>}
          {alliances.map((a) => {
            const gid = Number(a.gid);
            const checked = selected.includes(gid);
            return (
              <label key={a.gid} className="flex cursor-pointer items-center justify-between rounded border border-slate-200 px-2 py-1 text-sm hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={checked} onChange={() => toggleAlliance(gid)} />
                  <span className="font-semibold">[{a.gnick ?? gnickByGid.get(gid) ?? "NO TAG"}]</span>
                  <span className="text-xs text-slate-500">gid={a.gid}</span>
                </div>
                <span className="text-xs text-slate-500">members {a.current.memberCount}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="rounded border border-slate-200 p-3">
        <p className="mb-2 text-sm font-semibold text-slate-800">Трекинг отдельного игрока</p>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">wid</span>
            <input className="w-full rounded border border-slate-300 px-2 py-1" type="number" value={trackPlayerWid} onChange={(e) => setTrackPlayerWid(Number(e.target.value) || 0)} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">pid</span>
            <input className="w-full rounded border border-slate-300 px-2 py-1" type="number" value={trackPlayerPid} onChange={(e) => setTrackPlayerPid(Number(e.target.value) || 0)} />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-slate-600">note (опционально)</span>
            <input className="w-full rounded border border-slate-300 px-2 py-1" value={trackPlayerNote} onChange={(e) => setTrackPlayerNote(e.target.value)} />
          </label>
        </div>
        <div className="mt-2">
          <button className="rounded bg-cyan-700 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-800 disabled:opacity-60" disabled={status.loading} onClick={trackPlayer}>
            Добавить игрока в tracking
          </button>
        </div>
      </div>

      {status.loading && <p className="text-sm text-slate-600">Выполняется запрос...</p>}
      {status.error && <p className="rounded bg-rose-50 p-2 text-sm text-rose-700">{status.error}</p>}
      {status.message && <p className="rounded bg-emerald-50 p-2 text-sm text-emerald-700">{status.message}</p>}
    </div>
  );
}
