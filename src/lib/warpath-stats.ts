type BigIntString = string | null;

export type PlayerDatasetPoint = {
  day: number;
  gid: number | null;
  gnick: string | null;
  cid?: number | null;
  ccid?: number | null;
  nick: string | null;
  lv: number | null;
  power: BigIntString;
  maxpower: BigIntString;
  sumkill: BigIntString;
  die: BigIntString;
  score: BigIntString;
  caiji: BigIntString;
  allianceTechContribution: BigIntString;
  allianceHelp: BigIntString;
  createdAt: string | null;
};

export type PlayerDatasetResponse = {
  wid: number;
  pid: number;
  fromDayInt: number;
  toDayInt: number;
  points: number;
  series: PlayerDatasetPoint[];
};

export type WorldModeResponse = {
  wid: number;
  mode: "16" | "80" | "unknown";
  confidence: number;
  method: "rule" | "ratio" | "fallback";
  ratio16: number | null;
  sampledDistinctCcid: number;
  sampledFromDayInt: number | null;
  sampledToDayInt: number | null;
};

export type CityTrendResponse = {
  wid: number;
  ccid: number;
  name: string | null;
  city80Name: string | null;
  city16Name: string | null;
  mode: "16" | "80" | "unknown";
  range: { fromDayInt: number; toDayInt: number };
  points: number;
};

export type V1AllianceCard = {
  wid: number;
  gid: string;
  gnick?: string | null;
  name?: string | null;
  owner?: string | null;
  current: {
    power: string;
    kil: string;
    di: string;
    memberCount: number;
  };
  delta: {
    d7?: {
      power: { abs: string; pct?: number | null };
      kil: { abs: string; pct?: number | null };
      di: { abs: string; pct?: number | null };
      members: { abs: string; pct?: number | null };
    };
  };
  lastDayInt: number;
};

export type V1PlayerCard = {
  wid: number;
  pid: string;
  nick: string;
  level: number | null;
  currentAlliance: { gid: string | null; gnick: string | null };
  current: {
    power: string;
    maxPower: string;
    sumkill: string;
    die: string;
    score: string;
    gx: string;
    bz: string;
  };
  delta: { d7?: { power: { abs: string; pct?: number | null } } };
  lastDayInt: number;
};

const BASE_URL =
  process.env.WARPATH_STATS_API_URL ||
  process.env.NEXT_PUBLIC_WARPATH_STATS_API_URL ||
  "http://localhost:3001";

async function fetchJson<T>(path: string, revalidateSeconds = 120): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    next: { revalidate: revalidateSeconds },
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`warpath-stats request failed: ${res.status} ${path} ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

export async function getPlayerDataset(
  wid: number,
  pid: number,
  from: number,
  to: number
): Promise<PlayerDatasetResponse> {
  return fetchJson<PlayerDatasetResponse>(`/players/${wid}/${pid}/dataset?from=${from}&to=${to}`, 90);
}

export async function getWorldMode(wid: number): Promise<WorldModeResponse> {
  return fetchJson<WorldModeResponse>(`/worlds/${wid}/mode`, 300);
}

export async function getCityTrend(
  wid: number,
  ccid: number,
  from: number,
  to: number
): Promise<CityTrendResponse> {
  return fetchJson<CityTrendResponse>(`/views/worlds/${wid}/cities/${ccid}/trend?from=${from}&to=${to}`, 120);
}

export async function getV1Worlds() {
  return fetchJson<{ data: Array<{ wid: number; label: string; lastDayInt: number | null; trackedAlliances: number }> }>(`/api/v1/worlds`, 120);
}

export async function getV1Alliances(
  wid: number,
  options?: { page?: number; pageSize?: number; q?: string; sort?: string }
) {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 25;
  const q = options?.q ? `&q=${encodeURIComponent(options.q)}` : "";
  const sort = options?.sort ? `&sort=${encodeURIComponent(options.sort)}` : "";
  return fetchJson<{ data: V1AllianceCard[]; meta: { total: number; hasNext: boolean } }>(
    `/api/v1/alliances?wid=${wid}&page=${page}&pageSize=${pageSize}${q}${sort}`,
    90
  );
}

export async function getV1Players(
  wid: number,
  options?: { page?: number; pageSize?: number; q?: string; sort?: string; window?: "1d" | "7d" | "30d" | "90d" }
) {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 25;
  const q = options?.q ? `&q=${encodeURIComponent(options.q)}` : "";
  const sort = options?.sort ? `&sort=${encodeURIComponent(options.sort)}` : "";
  const window = options?.window ? `&window=${options.window}` : "";
  return fetchJson<{ data: V1PlayerCard[]; meta: { total: number; hasNext: boolean } }>(
    `/api/v1/players?wid=${wid}&page=${page}&pageSize=${pageSize}${q}${sort}${window}`,
    60
  );
}

export async function getV1AllianceProfile(wid: number, gid: number) {
  return fetchJson<{ data: { alliance: V1AllianceCard } }>(`/api/v1/alliances/${gid}?wid=${wid}`, 90);
}

export async function getV1AllianceTransfers(wid: number, gid: number, fromDay: number, toDay: number) {
  return fetchJson<{ data: { events: Array<{ pid: string; dayInt: number; type: "in" | "out"; nick: string; fromGnick: string | null; toGnick: string | null }> } }>(
    `/api/v1/alliances/${gid}/transfers?wid=${wid}&fromDay=${fromDay}&toDay=${toDay}&type=all`,
    60
  );
}

export async function getV1AllianceRoster(wid: number, gid: number, page = 1, pageSize = 100) {
  return fetchJson<{
    data: Array<{
      pid: string;
      nick: string;
      level: number | null;
      power: string;
      sumkill: string;
      die: string;
      dPower7d: string;
      dSumkill7d: string;
      killDeath: number | null;
      memberDays: number;
      role: string;
    }>;
    meta: { total: number; hasNext: boolean };
  }>(`/api/v1/alliances/${gid}/roster?wid=${wid}&page=${page}&pageSize=${pageSize}`, 60);
}

export async function getV1AllianceActions(wid: number, gid: number, fromDay: number, toDay: number) {
  return fetchJson<{ data: { actions: Array<{ dayInt: number; type: string; title: string; from?: string | number | null; to?: string | number | null; delta?: string | number | null }> } }>(
    `/api/v1/alliances/${gid}/actions?wid=${wid}&fromDay=${fromDay}&toDay=${toDay}`,
    60
  );
}

export function dayIntToDate(dayInt: number): Date {
  const s = String(dayInt);
  const y = Number(s.slice(0, 4));
  const m = Number(s.slice(4, 6));
  const d = Number(s.slice(6, 8));
  return new Date(Date.UTC(y, m - 1, d));
}

export function dateToDayInt(dt: Date): number {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return Number(`${y}${m}${d}`);
}

export function addDays(dayInt: number, offset: number): number {
  const dt = dayIntToDate(dayInt);
  dt.setUTCDate(dt.getUTCDate() + offset);
  return dateToDayInt(dt);
}

export function formatDay(dayInt: number): string {
  const dt = dayIntToDate(dayInt);
  return dt.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
}

export function parseBigIntString(v: string | null | undefined): bigint {
  if (!v) return BigInt(0);
  try {
    return BigInt(v);
  } catch {
    return BigInt(0);
  }
}
