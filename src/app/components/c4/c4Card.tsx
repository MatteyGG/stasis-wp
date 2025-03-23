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
      style={{ backgroundImage: `url(/source/c4/${map}.png)` }}
    >
      <div className=" fill-inherit  rounded-md">
        <div className="overlay"></div>
        <p className="status text-md bg-green-500 bg-opacity-30 text-white rounded-md hover:bg-green-600">
          <span>{status}</span>
        </p>
        <div className="inline-flex gap-1 ">
          <p className="players text-sm">
            Игроки: <span>{players}</span>
          </p>
          <p className="map text-sm">
            Карта: <span>{maps[map as keyof typeof maps]}</span>
          </p>
        </div>

        <button>Статистика</button>
      </div>
    </div>
  );
}

