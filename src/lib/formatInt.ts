export function formatInt(v: string | number | bigint | null | undefined): string {
  if (v === null || v === undefined) return "0";
  try {
    const n = typeof v === "bigint" ? v : BigInt(String(v));
    return n.toLocaleString("ru-RU");
  } catch {
    const n = Number(v);
    if (!Number.isFinite(n)) return "0";
    return Math.trunc(n).toLocaleString("ru-RU");
  }
}
