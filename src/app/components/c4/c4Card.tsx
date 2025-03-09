import Image from "next/image";
import React from "react";

interface C4CardProps {
  serverName: string;
  status: string;
  players: string;
  map: string;
  mapImage: string;
}

export default function C4Card({ serverName, status, players, map, mapImage }: C4CardProps) {
  return (
    <div
      className="serverCard rounded-md shadow-md shadow-black"
      style={{ backgroundImage: `url(${mapImage})` }}
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
            Карта: <span>{map}</span>
          </p>
        </div>

        <button>Статистика</button>
      </div>
    </div>
  );
}

