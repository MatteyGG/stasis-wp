"use client";

/* eslint-disable @next/next/no-async-client-component */
import Image from "next/image";
import { useEffect, useState } from "react";
import React from "react";

interface Player {
  username: string;
  power: string;
  ally: string;
  kills: string;
  death: string;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<Player[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServer = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://yx.dmzgame.com/intl_warpath/rank_pid?day=20241205&wid=130&ccid=0&rank=power&is_benfu=1&is_quanfu=0&page=1&perPage=3000",
          {
            method: "GET",
          }
        );
        if (response) {
          const data = await response.json();
          console.log(data);
          const players = data.Data.map(
            (player) => ({
              ally: player.gnick,
              nick: player.nick,
              power: Number(player.power).toLocaleString(),
              sumkill: player.sumkill,
              die: player.die,
            } as const)
          );

          console.log(players);
          setUsers(players.sort((a, b) => b.power - a.power));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServer();
  }, []);

  if (isLoading) {
    return (
      <form>
        <h1>Loading...</h1>
      </form>
    );
  }
  return (
    <ul className="text-left w-full rounded-xl space-y-1">
      {Object.values(users).map((user, index) => {
        return (
          <li
            className="grid grid-cols-6 grid-rows-2 mx-auto px-4 py-1 ease-in-out duration-300 hover:scale-[1.2] bg-white rounded-xl shadow-md md:max-w-2xl"
            key={index}
          >
            <div className="row-span-2">
              <p
                className={`h-full text-center p-4 text-align:center ${
                  index + 1 > 3 ? "" : "text-transparent"
                } bg-[url('/source/icon/Rank_Medaille0${
                  index + 1 > 3 ? "" : index + 1
                }.png')] bg-center bg-contain bg-no-repeat`}
              >
                <b>{index + 1}</b>
              </p>
            </div>
            <div className="col-span-3 text-nowrap">
              <h1>
                [{user.ally}] {user.nick}
              </h1>
            </div>
            <div className="col-span-2 row-span-2 text-center ">
              <p className="text-nowrap">{user.power}</p>
            </div>
            <div className="w-full col-span-3 inline-flex items-center">
              <Image
              className="object-contain"
                src="/source/icon/kills.png"
                width={20}
                height={20}
                alt=""
              />
              <h1>{user.sumkill}</h1>&nbsp;K/D:&nbsp;
              <h1>
                {isNaN(user.sumkill / user.die)
                  ? "0"
                  : (user.sumkill / user.die).toFixed(2)}
              </h1>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
