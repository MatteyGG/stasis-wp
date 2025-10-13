// components/ExtendedPlayerCard.tsx
import Image from 'next/image';
import { WarpathPlayer } from '@/lib/types';
import { motion } from 'framer-motion';

interface ExtendedPlayerCardProps {
  player: WarpathPlayer;
  rank: number;
}

export default function ExtendedPlayerCard({ player, rank }: ExtendedPlayerCardProps) {
  // Функция для получения класса фона в зависимости от ранга
  const getRankBackgroundClass = (index: number) => {
    switch(index) {
      case 0: return "text-transparent bg-[url('/source/icon/Rank_Medaille01.png')]";
      case 1: return "text-transparent bg-[url('/source/icon/Rank_Medaille02.png')]";
      case 2: return "text-transparent bg-[url('/source/icon/Rank_Medaille03.png')]";
      default: return "bg-[url('/source/icon/Rank_Medaille0.png')]";
    }
  };

  return (
    <motion.div
      className="w-full bg-gray-100 border-l-4 border-blue-500 rounded-b-xl shadow-lg p-6 mt-1"
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Заголовок с медалью и именем */}
      <div className="flex items-center space-x-4 mb-6">
        <div className={`h-16 w-16 bg-center bg-contain bg-no-repeat ${getRankBackgroundClass(rank)}`}>
          <span className="sr-only">Rank {rank + 1}</span>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            [{player.gnick}] {player.nick}
          </h1>
          <p className="text-gray-600">Мощность: {player.power.toLocaleString()}</p>
        </div>
      </div>

      {/* Основная информация */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">Основная статистика</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Уничтожено юнитов:</span>
                <span className="font-bold text-lg">{player.sumkill.toLocaleString('ru-RU')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Потери:</span>
                <span className="font-bold text-lg">{player.die.toLocaleString('ru-RU')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">K/D Ratio:</span>
                <span className="font-bold text-lg text-blue-600">
                  {(player.sumkill / player.die || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">Ресурсы</h3>
            <div className="flex items-center space-x-3">
              <Image
                src="/source/icon/resources.png"
                width={28}
                height={28}
                alt="Ресурсы"
                className="flex-shrink-0"
              />
              <div>
                <div className="font-semibold">Собрано ресурсов</div>
                <div className="text-lg font-bold text-green-600">
                  {(Number(player.caiji) / 1000000).toFixed(0)}M
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">Детализация убийств по уровням</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {player.kills.slice(0, 6).map((kill, index) => (
                <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="font-bold text-base">{kill}</div>
                  <div className="text-gray-500 text-xs mt-1">Ур. {index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительная информация, если нужно больше высоты */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>ID игрока: {player.id}</span>
          <span>Альянс: {player.gnick}</span>
        </div>
      </div>
    </motion.div>
  );
}