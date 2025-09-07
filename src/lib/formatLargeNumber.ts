// lib/formatLargeNumber.ts

export function formatLargeNumber(num: bigint | number | null | undefined): string {
  if (num === null || num === undefined) return '0';

  const numValue = typeof num === 'bigint' ? Number(num) : num;

  if (numValue >= 1000000000) {
    return (numValue / 1000000000).toFixed(1).replace('.', ',') + ' млрд';
  }
  if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1).replace('.', ',') + ' млн';
  }
  if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1).replace('.', ',') + ' тыс';
  }

  return numValue.toLocaleString('ru-RU');
}