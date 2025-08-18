// app/c4/[c4Id]/page.tsx
import React from "react";
import { prisma } from "@/lib/prisma";
import C4StatsTable from "@/app/components/C4StatsTable";


interface C4StatsPageProps {
  params: { c4Id: string };
}

export default async function C4StatsPage({ params }: C4StatsPageProps) {
  const c4Event = await prisma.c4.findUnique({
    where: { id: params.c4Id },
    include: {
      stats: {
        include: {
          player: true
        }
      }
    }
  });

  if (!c4Event) {
    return <div>Событие не найдено</div>;
  }

  // Формируем данные для таблиц
  const statsData = c4Event.stats.map(s => ({
    id: s.id,
    warpathId: s.warpathId,
    username: s.username, // Используем ник из снапшота
    TownHall: s.TownHall,
    power: s.power,
    kill: s.kill,
    die: s.die,
    kd: s.kd
  }));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Статистика завоевания: {c4Event.map}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-2">Общая информация</h3>
          <p>Начало: {new Date(c4Event.startedAt).toLocaleString()}</p>
          <p>Окончание: {c4Event.endedAt ? 
            new Date(c4Event.endedAt).toLocaleString() : "В процессе"}</p>
          <p>Участников: {c4Event.stats.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-2">Альянсы</h3>
          {/* Топ альянсов по количеству участников */}
          {Array.from(
            new Map(statsData.map(s => [s.ally, statsData.filter(p => p.ally === s.ally).length]))
            .entries()
          )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([ally, count]) => (
            <p key={ally}>{ally}: {count} игроков</p>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-2">Средние показатели</h3>
          <p>Сила: {(statsData.reduce((sum, p) => sum + p.power, 0) / statsData.length).toLocaleString()}</p>
          <p>Убийства: {(statsData.reduce((sum, p) => sum + p.kill, 0) / statsData.length).toFixed(1)}</p>
          <p>К/Д: {(statsData.reduce((sum, p) => sum + p.kd, 0) / statsData.length).toFixed(2)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <C4StatsTable
          snapshots={statsData} 
          title="Топ по силе" 
          sortField="power" 
        />
        
        <C4StatsTable 
          snapshots={statsData} 
          title="Топ по убийствам" 
          sortField="kill" 
        />
        
        <C4StatsTable 
          snapshots={statsData} 
          title="Топ по К/Д" 
          sortField="kd" 
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Полная статистика</h2>
        <C4StatsTable 
          snapshots={statsData} 
          title="Все участники" 
          sortField="power" 
        />
      </div>
    </div>
  );
}