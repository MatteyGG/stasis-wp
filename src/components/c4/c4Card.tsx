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

export default function C4Card({  status, players, map }: C4CardProps) {
  return (
    <div
      className="serverCard rounded-md shadow-md shadow-black"
      style={{ backgroundImage: `url(/source/c4/${map}.png)`,width: `490px`, height: `350px` }}
    >
      <div className="flex flex-col fill-inherit  rounded-md min-h-full">
        <div className="overlay"></div>
        <p className="status py-2 text-md bg-green-500 bg-opacity-30 text-white rounded-md hover:bg-green-600">
          {status === "active" ? "В процессе" : "Завершено"}
        </p>
        <div className="flex-col gap-1 py-2">
          <p className="players text-sm">
            Игроки: <span>{players}</span>
          </p>
          <p className="map text-sm">
            Карта: <span>{maps[map as keyof typeof maps]}</span>
          </p>
        </div>

        <div className="flex flex-grow"></div>

        <button className="bottom-0 w-full py-2  text-white rounded-b-md ">
          Статистика
        </button>
      </div>
    </div>
  );
}

