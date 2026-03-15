import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getV1Alliances, getV1Players } from "@/lib/warpath-stats";

type PageProps = {
  searchParams: Promise<{ wid?: string; q?: string; page?: string }>;
};

function toInt(v: string | undefined): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}

export default async function AlliancesPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) return <div className="p-6 text-sm text-slate-600">Требуется авторизация.</div>;

  const sp = await searchParams;
  const wid = toInt(sp.wid) ?? 130;
  const page = Math.max(1, toInt(sp.page) ?? 1);
  const q = typeof sp.q === "string" ? sp.q : "";
  const [result, playersForTags] = await Promise.all([
    getV1Alliances(wid, { page, pageSize: 30, q, sort: "power:desc" }),
    getV1Players(wid, { page: 1, pageSize: 500, sort: "power:desc", window: "7d" }),
  ]);
  const gnickByGid = new Map<string, string>();
  for (const p of playersForTags.data) {
    const gid = p.currentAlliance.gid;
    const gnick = p.currentAlliance.gnick;
    if (gid && gnick && !gnickByGid.has(gid)) gnickByGid.set(gid, gnick);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Альянсы мира {wid}</h1>
        <Link href={`/statistics/worlds/${wid}`} className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">
          К дашборду мира
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Поиск</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap gap-2">
            <input type="number" name="wid" defaultValue={wid} className="w-28 rounded border border-slate-300 px-2 py-2 text-sm" />
            <input name="q" defaultValue={q} placeholder="поиск по owner/тегу" className="w-full max-w-sm rounded border border-slate-300 px-3 py-2 text-sm" />
            <button className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">Применить</button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {result.data.map((a) => (
          <Card key={a.gid}>
            <CardHeader>
              <CardTitle className="text-base">[{a.gnick ?? gnickByGid.get(String(a.gid)) ?? "NO TAG"}]</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>Power: {a.current.power}</p>
              <p>Kill: {a.current.kil}</p>
              <p>Die: {a.current.di}</p>
              <p>Members: {a.current.memberCount}</p>
              <Link href={`/statistics/alliances/${wid}/${a.gid}`} className="inline-block rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-900">
                Открыть
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
