// src/lib/mvpUtils.ts
import { C4, C4Statistic } from "@prisma/client";
import { formatLargeNumber } from "./formatLargeNumber";

export function calculateMvpData(c4: C4&{statistics: C4Statistic[]}) {
  // Проверяем, что c4 существует и statistics - это массив
  if (!c4 || !Array.isArray(c4.statistics)) {
    return []; // Возвращаем пустой массив, если данных нет
  }

  const statistics = c4.statistics;

  // Если статистика пуста, возвращаем пустой массив
  if (statistics.length === 0) {
    return [];
  }

  // Остальная логика расчета MVP...
  const topKill = [...statistics]
    .sort((a, b) => (b.killGain || 0) - (a.killGain || 0))[0];

  const topPower = [...statistics]
    .sort((a, b) => (b.powerGain || 0) - (a.powerGain || 0))[0];

  const topKD = [...statistics]
    .sort((a, b) => (b.kdGain || 0) - (a.kdGain || 0))[0];

  const topDie = [...statistics]
    .sort((a, b) => (b.dieGain || 0) - (a.dieGain || 0))[0];

  const topResource = [...statistics]
    .sort((a, b) => {
      const aResource = a.resourceCollectionGain || 0;
      const bResource = b.resourceCollectionGain || 0;
      return Number(bResource) - Number(aResource);
    })[0];

  const mvps = [
    {
      player: topKill,
      category: 'kill',
      title: 'Ультра убийца',
      image: '/mvps/kill.png',
      value: topKill?.killGain || 0
    },
    {
      player: topPower,
      category: 'power',
      title: 'Растишка',
      image: '/mvps/power.png',
      value: topPower?.powerGain || 0
    },
    {
      player: topKD,
      category: 'kd',
      title: 'Элитный солдат',
      image: '/mvps/kd.png',
      value: topKD?.kdGain || 0
    },
    {
      player: topDie,
      category: 'die',
      title: 'Жертвенная овечка',
      image: '/mvps/die.png',
      value: topDie?.dieGain || 0
    },
    { 
      player: topResource, 
      category: 'resource',
      title: 'Главный фермер',
      image: '/mvps/collect.png',
      value: formatLargeNumber(topResource?.resourceCollectionGain || BigInt(0))
    },
  ];

  return mvps.map(mvp => ({
    ...mvp,
    value: typeof mvp.value === 'bigint' ? formatLargeNumber(mvp.value) : mvp.value,
  }));
}