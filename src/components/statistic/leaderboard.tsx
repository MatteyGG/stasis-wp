// src/components/statistic/leaderboard.tsx
"use client";
import { WarpathPlayer } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExtendedPlayerCard from "./PlayerCard";

interface LeaderboardProps {
  players: WarpathPlayer[];
}

export default function Leaderboard({ players }: LeaderboardProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<{player: WarpathPlayer, rank: number} | null>(null);
  const [selectedAlliance, setSelectedAlliance] = useState<string>("Не выбрано");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Сбрасываем флаг начальной загрузки после монтирования
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Расчет популярности альянсов и создание опций фильтра
  const allianceOptions = useMemo(() => {
    // Подсчитываем количество игроков в каждом альянсе
    const allianceCounts = players.reduce((acc, player) => {
      const alliance = player.gnick || "Без альянса";
      acc[alliance] = (acc[alliance] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Сортируем альянсы по популярности и фильтруем (минимум 3 игрока)
    const sortedAlliances = Object.entries(allianceCounts)
      .filter(([, count]) => count >= 3) // Только альянсы с 3+ игроками
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([alliance]) => alliance);

    return ["Не выбрано", ...sortedAlliances];
  }, [players]);

  // Фильтрация и сортировка игроков на основе выбора
  const filteredAndSortedPlayers = useMemo(() => {
    // Фильтруем игроков по выбранному альянсу
    let filtered = players;
    if (selectedAlliance !== "Не выбрано") {
      filtered = players.filter(player => 
        selectedAlliance === "Без альянса" 
          ? !player.gnick 
          : player.gnick === selectedAlliance
      );
    }

    // Примечание: массив players уже приходит отсортированным по силе
    return filtered;
  }, [players, selectedAlliance]);

  const handlePlayerClick = (player: WarpathPlayer, rank: number) => {
    setSelectedPlayer(selectedPlayer?.player.id === player.id ? null : { player, rank });
  };

  const handleAllianceChange = (alliance: string) => {
    setSelectedAlliance(alliance);
    setSelectedPlayer(null); // Сбрасываем выбранного игрока при смене альянса
  };

  // Функция для получения класса ранга
  const getRankClass = (index: number) => {
    switch(index) {
      case 0: return "text-transparent bg-[url('/source/icon/Rank_Medaille01.png')]";
      case 1: return "text-transparent bg-[url('/source/icon/Rank_Medaille02.png')]";
      case 2: return "text-transparent bg-[url('/source/icon/Rank_Medaille03.png')]";
      default: return "bg-[url('/source/icon/Rank_Medaille0.png')]";
    }
  };

  // Анимация для элементов списка
const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: isInitialLoad ? index * 0.05 : 0,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};



  // Анимация для контейнера списка
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Выпадающий список для фильтрации по альянсам */}
      <motion.div 
        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <label htmlFor="alliance-select" className="block text-sm font-semibold text-gray-700 mb-3">
          Фильтр по альянсам
        </label>
        <div className="relative">
          <select
            id="alliance-select"
            value={selectedAlliance}
            onChange={(e) => handleAllianceChange(e.target.value)}
            className="w-full p-3 pl-4 pr-10 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm appearance-none cursor-pointer"
          >
            {allianceOptions.map((alliance) => (
              <option key={alliance} value={alliance}>
                {alliance} {alliance !== "Не выбрано" && `(${players.filter(p => (p.gnick || "Без альянса") === alliance).length})`}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {selectedAlliance === "Не выбрано" 
            ? `Показаны все игроки: ${players.length}`
            : `Альянс "${selectedAlliance}": ${filteredAndSortedPlayers.length} игроков`
          }
        </p>
      </motion.div>

      {/* Анимированный список игроков */}
      <AnimatePresence mode="wait">
        <motion.ul
          key={selectedAlliance} // Это заставляет анимировать при смене альянса
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          className="p-2 space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedPlayers.map((user, index) => (
              <motion.li
                key={user.id}
                custom={index}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout // Добавляем автоматическую анимацию layout
                className="relative"
              >
                {/* Кликабельная карточка игрока */}
                <motion.div
                  className="overflow-visible grid grid-cols-6 grid-rows-2 mx-auto px-4 py-3 ease-in-out duration-300 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer border border-gray-100"
                  whileHover={{ 
                    scale: 1.02,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlayerClick(user, index)}
                  layoutId={`player-${user.id}`}
                >
                  <div className="row-span-2 flex items-center justify-center">
                    <motion.p 
                      className={`h-12 w-12 flex items-center justify-center text-center bg-contain bg-no-repeat ${getRankClass(index)}`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <b className={index < 3 ? "hidden" : "block"}>{index + 1}</b>
                    </motion.p>
                  </div>
                  
                  <div className="col-span-3 text-nowrap flex items-center">
                    <h1 className="text-lg font-semibold text-gray-800">
                      [{user.gnick}] {user.nick}
                    </h1>
                  </div>

                  <div className="col-span-1 row-span-2 flex items-center justify-end">
                    <Link
                      href={`/statistics/player/${user.wid}/${user.pid}`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md border border-blue-300 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      Профиль
                    </Link>
                  </div>
                  
                  <div className="col-span-1 row-span-2 text-center flex flex-col justify-center">
                    <p className="text-nowrap text-xl font-bold text-blue-600">
                      {user.power.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">сила</p>
                  </div>
                  
                  <div className="w-full col-span-3 inline-flex items-center space-x-2">
                    <Image
                      className="object-contain"
                      src="/source/icon/kills.png"
                      width={20}
                      height={20}
                      alt="Убийства"
                    />
                    <span className="font-medium text-gray-700">
                      {user.sumkill.toLocaleString('ru-RU')}
                    </span>
                    <span className="text-gray-500">K/D:</span>
                    <span className="font-medium text-green-600">
                      {(user.sumkill / user.die || 0).toFixed(2)}
                    </span>
                  </div>
                </motion.div>

                {/* Выдвигающаяся детальная карточка */}
                <AnimatePresence>
                  {selectedPlayer?.player.id === user.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30,
                        duration: 0.3
                      }}
                      className="overflow-hidden"
                    >
                      <ExtendedPlayerCard  
                        player={selectedPlayer.player} 
                        rank={selectedPlayer.rank} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </AnimatePresence>

      {/* Сообщение если нет игроков */}
      {filteredAndSortedPlayers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-white rounded-2xl shadow-lg"
        >
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Игроки не найдены
          </h3>
          <p className="text-gray-500">
            {selectedAlliance === "Не выбрано" 
              ? "В списке нет игроков" 
              : `В альянсе "${selectedAlliance}" нет игроков, удовлетворяющих условиям`
            }
          </p>
        </motion.div>
      )}
    </div>
  );
}
