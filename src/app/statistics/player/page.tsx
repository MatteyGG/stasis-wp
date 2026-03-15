import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlayerStatsEntryPage() {
  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Профиль игрока</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Открой карточку игрока напрямую по формату:
          </p>
          <code className="block rounded bg-slate-100 p-2 text-sm">
            /statistics/player/&lt;wid&gt;/&lt;pid&gt;?from=YYYYMMDD&amp;to=YYYYMMDD
          </code>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">Примеры:</p>
            <div className="flex flex-wrap gap-2">
              <Link
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                href="/statistics/player/130/29937997?from=20260215&to=20260311"
              >
                Игрок 29937997 (W130)
              </Link>
              <Link
                className="rounded bg-slate-700 px-3 py-1 text-sm text-white hover:bg-slate-800"
                href="/statistics"
              >
                Вернуться к топу
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
