import React from "react";

interface C4CardProps {
  status: string;
  players: string;
  map: string;
}
const maps = {
  cairo: "Каир",
  newyork: "Нью-Йорк",
  moscow: "Москва",
  sea: "Эгейское море",
  vancouver: "Ванкувер",
  berlin: "Берлин",
  paris: "Париж",
  london: "Лондон",
  rome: "Рим",
  chicago: "Чикаго",
  sanfrancisco: "Сан-Франциско",
};

export default function C4Card({ status, players, map }: C4CardProps) {
  return (
    <div
      className=" rounded-md bg-cover bg-center w-full h-full min-h-[300px]"
      style={{ backgroundImage: `url(/source/c4/${map}.png)` }}
    >
      <div className="flex flex-col h-full rounded-md p-4 bg-black bg-opacity-40">
        <p className="status py-2 text-sm md:text-md bg-green-500 bg-opacity-30 text-white rounded-md hover:bg-green-600 text-center mb-2 md:mb-4">
          {status === "active" ? "В процессе" : "Завершено"}
        </p>
        
        <div className="flex-grow"></div>
        
        <div className="bg-black bg-opacity-50 p-3 rounded-md">
          <div className="flex-col gap-1">
            <p className=" text-sm md:text-base text-white mb-1">
              Игроки: <span className="font-semibold text-white">{players}</span>
            </p>
            <p className="map text-sm md:text-base text-white">
              Карта: <span className="font-semibold">{maps[map as keyof typeof maps]}</span>
            </p>
          </div>

          <button className="hidden mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm md:text-base">
            Статистика
          </button>
        </div>
      </div>
    </div>
  );
}