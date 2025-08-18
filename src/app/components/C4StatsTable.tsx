// components/C4StatsTable.tsx
import React from "react";

interface PlayerStat {
  id: string;
  warpathId: number;
  username: string;
  ally: string;
  TownHall: number;
  power: number;
  kill: number;
  die: number;
  kd: number;
}

interface C4StatsTableProps {
  snapshots: PlayerStat[];
  title: string;
  sortField: keyof PlayerStat;
}

const C4StatsTable: React.FC<C4StatsTableProps> = ({ 
  snapshots, 
  title,
  sortField 
}) => {
  const sorted = [...snapshots].sort((a, b) => 
    (b[sortField] as number) - (a[sortField] as number)
  ).slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Игрок</th>
              <th className="px-4 py-2 text-left">Альянс</th>
              <th className="px-4 py-2 text-left">Ратуша</th>
              <th className="px-4 py-2 text-left">Сила</th>
              <th className="px-4 py-2 text-left">Убийств</th>
              <th className="px-4 py-2 text-left">Смертей</th>
              <th className="px-4 py-2 text-left">К/Д</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sorted.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{player.username}</td>
                <td className="px-4 py-2">{player.ally}</td>
                <td className="px-4 py-2">{player.TownHall}</td>
                <td className="px-4 py-2">{player.power.toLocaleString()}</td>
                <td className="px-4 py-2">{player.kill.toLocaleString()}</td>
                <td className="px-4 py-2">{player.die.toLocaleString()}</td>
                <td className="px-4 py-2 font-semibold">{player.kd.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default C4StatsTable;