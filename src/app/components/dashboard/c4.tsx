"use client";

import React, { useEffect, useState } from "react";
import C4Card from "../c4/c4Card";

const maps = {"cairo" : "Каир", "newyork" : "Нью-Йорк", "moscow" : "Москва", "sea" : "Эгейское море", "vancouver" : "Ванкувер", "berlin" : "Берлин", "paris" : "Париж", "london" : "Лондон", "rome" : "Рим", "chicago":"Чикаго", "sanfrancisco" : "Сан-Франциско"};

const C4Dashboard: React.FC = () => {
  const [currentC4, setCurrentC4] = useState({ status: "", players: "", map: "", link: "" });

  useEffect(() => {
    fetch("/api/c4")
      .then((res) => res.json())
      .then((data) => setCurrentC4(data.c4));
  }, []);


  return (
    <div className="px-5 w-full  md:w-1/2 flex flex-col gap-3 justify-center">
      <div className="flex flex-col justify-items-start gap-3">
        <label className="flex justify-start">
          Status
          <input
            type="text"
            value={currentC4.status}
            onChange={(e) =>
              setCurrentC4({ ...currentC4, status: e.target.value })
            }
            className="p-2 border-2 rounded ml-2"
          />
        </label>
        <label className="flex justify-start">
          Players
          <input
            type="text"
            value={currentC4.players}
            onChange={(e) =>
              setCurrentC4({ ...currentC4, players: e.target.value })
            }
            className="p-2 border-2 rounded ml-2"
          />
        </label>
        <label className="flex justify-start">
          Map
          <select
            value={currentC4.map}
            onChange={(e) =>
              setCurrentC4({ ...currentC4, map: e.target.value })
            }
            className="p-2 border-2 rounded ml-2"
          >
            {Object.entries(maps).map(([key, value]) => (
              <option value={key} key={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col place-items-center justify-center">
        <C4Card {...currentC4} />
        <button
        className="p-2 border-2 rounded"
        onClick={() => fetch("/api/c4", { method: "POST", body: JSON.stringify(currentC4) })}>Обновить</button>
      </div>
    </div>
  );
};

export default C4Dashboard;

