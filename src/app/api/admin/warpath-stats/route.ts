import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";

type ActionBody =
  | { action: "syncLatest" }
  | { action: "refreshCities" }
  | { action: "serverScan"; wid: number; dayInt: number; page?: number; perPage?: number }
  | { action: "serverBackfill"; wid: number; fromDayInt: number; toDayInt: number; page?: number; perPage?: number }
  | { action: "trackAlliances"; wid: number; gids: number[] }
  | { action: "trackPlayer"; wid: number; pid: number; note?: string; fromDayInt?: number; toDayInt?: number; backfillDays?: number };

const BASE_URL =
  process.env.WARPATH_STATS_API_URL ||
  process.env.NEXT_PUBLIC_WARPATH_STATS_API_URL ||
  "http://localhost:3001";

async function callWarpath(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    return { ok: false, status: res.status, body };
  }
  return { ok: true, status: res.status, body };
}

function isInt(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v);
}

export async function GET(req: NextRequest) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const widParam = req.nextUrl.searchParams.get("wid");
  const wid = widParam && Number.isInteger(Number(widParam)) ? Number(widParam) : 130;
  const [health, worlds, cities, surfacedAlliances, trackedAlliances, trackedPlayers] = await Promise.all([
    callWarpath("/health"),
    callWarpath("/api/v1/worlds"),
    callWarpath("/reference/cities"),
    callWarpath(`/api/v1/alliances?wid=${wid}&page=1&pageSize=200`),
    callWarpath("/alliances"),
    callWarpath("/tracked-players"),
  ]);

  return NextResponse.json({
    baseUrl: BASE_URL,
    health,
    worlds,
    cities,
    surfacedAlliances,
    trackedAlliances,
    trackedPlayers,
  });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  let body: ActionBody;
  try {
    body = (await req.json()) as ActionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("action" in body)) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (body.action === "syncLatest") {
    const out = await callWarpath("/jobs/sync-latest", { method: "POST" });
    return NextResponse.json(out.body, { status: out.status });
  }

  if (body.action === "refreshCities") {
    const out = await callWarpath("/reference/cities/refresh", { method: "POST" });
    return NextResponse.json(out.body, { status: out.status });
  }

  if (body.action === "serverScan") {
    if (!isInt(body.wid) || !isInt(body.dayInt)) {
      return NextResponse.json({ error: "wid and dayInt must be integers" }, { status: 400 });
    }
    const out = await callWarpath("/jobs/server-scan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        wid: body.wid,
        dayInt: body.dayInt,
        page: isInt(body.page) ? body.page : 1,
        perPage: isInt(body.perPage) ? body.perPage : 3000,
      }),
    });
    return NextResponse.json(out.body, { status: out.status });
  }

  if (body.action === "serverBackfill") {
    if (!isInt(body.wid) || !isInt(body.fromDayInt) || !isInt(body.toDayInt)) {
      return NextResponse.json({ error: "wid/fromDayInt/toDayInt must be integers" }, { status: 400 });
    }
    const out = await callWarpath("/jobs/server-backfill", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        wid: body.wid,
        fromDayInt: body.fromDayInt,
        toDayInt: body.toDayInt,
        page: isInt(body.page) ? body.page : 1,
        perPage: isInt(body.perPage) ? body.perPage : 3000,
      }),
    });
    return NextResponse.json(out.body, { status: out.status });
  }

  if (body.action === "trackAlliances") {
    if (!isInt(body.wid) || !Array.isArray(body.gids) || body.gids.length === 0) {
      return NextResponse.json({ error: "wid and gids[] are required" }, { status: 400 });
    }
    const gids = body.gids.filter((x) => Number.isInteger(x) && x > 0);
    if (gids.length === 0) return NextResponse.json({ error: "gids must contain integers > 0" }, { status: 400 });

    const results = await Promise.all(
      gids.map(async (gid) => {
        const out = await callWarpath("/alliances", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ wid: body.wid, gid }),
        });
        return { gid, ok: out.ok, status: out.status, body: out.body };
      })
    );
    return NextResponse.json({
      ok: results.some((r) => r.ok),
      requested: gids.length,
      success: results.filter((r) => r.ok).length,
      results,
    });
  }

  if (body.action === "trackPlayer") {
    if (!isInt(body.wid) || !isInt(body.pid) || body.pid <= 0) {
      return NextResponse.json({ error: "wid and pid are required integers" }, { status: 400 });
    }
    const out = await callWarpath("/tracked-players", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        wid: body.wid,
        pid: body.pid,
        note: typeof body.note === "string" ? body.note : undefined,
        fromDayInt: isInt(body.fromDayInt) ? body.fromDayInt : undefined,
        toDayInt: isInt(body.toDayInt) ? body.toDayInt : undefined,
        backfillDays: isInt(body.backfillDays) ? body.backfillDays : undefined,
      }),
    });
    return NextResponse.json(out.body, { status: out.status });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
