// src/lib/mvpUtils.ts
import { formatLargeNumber } from "./formatLargeNumber";

export function calculateMvpData(c4: any) {
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
      const aResource = a.player?.resourceCollection || 0;
      const bResource = b.player?.resourceCollection || 0;
      return Number(bResource) - Number(aResource);
    })[0];

  const mvps = [
    {
      player: topKill,
      category: 'kill',
      title: 'Ультра убийца',
      image: '/kill.png',
      value: topKill?.killGain || 0
    },
    {
      player: topPower,
      category: 'power',
      title: 'Растишка',
      image: '/power.png',
      value: topPower?.powerGain || 0
    },
    {
      player: topKD,
      category: 'kd',
      title: 'Элитный солдат',
      image: '/kd.png',
      value: topKD?.kdGain || 0
    },
    {
      player: topDie,
      category: 'die',
      title: 'Жертвенная овечка',
      image: '/die.png',
      value: topDie?.dieGain || 0
    },
    { 
      player: topResource, 
      category: 'resource',
      title: 'Главный фермер',
      image: '/collect.png',
      value: formatLargeNumber(topResource?.player?.resourceCollection || BigInt(0))
    },
  ];

  return mvps.map(mvp => ({
    ...mvp,
    value: typeof mvp.value === 'bigint' ? formatLargeNumber(mvp.value) : mvp.value,
  }));
}