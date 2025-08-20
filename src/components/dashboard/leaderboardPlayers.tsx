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
  nick: string;
  sumkill: number;
  die: number;
  kd: number;
}

export default function PlayersLeaderboard() {
  const [users, setUsers] = useState<Player[]>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchServer() {
      try {
        const response = await fetch("/api/warpath/dataUpdate");
        const data = await response.json();
        console.log(data);
        setUsers(data[1]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching players leaderboard:", error);
      }
    }

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
    <ul className="max-h-screen p-2 text-left w-full rounded-xl space-y-1 overflow-x-hidden overscroll-auto focus:overscroll-contain">
      {Object.values(users).map((user, index) => {
        return (
          <li
            className=" overflow-visible grid grid-cols-6 grid-rows-2 mx-auto px-4 py-1 ease-in-out duration-300 hover:scale-[1.05] bg-white rounded-xl shadow-md md:max-w-2xl"
            key={index}
          >
            <div className="row-span-2">
              <p
                className={`h-full text-center p-4 text-align:center bg-center bg-contain bg-no-repeat ${
                  index === 0
                    ? "text-transparent bg-[url('/source/icon/Rank_Medaille01.png')]"
                    : index === 1
                    ? "text-transparent bg-[url('/source/icon/Rank_Medaille02.png')]"
                    : index === 2
                    ? "text-transparent bg-[url('/source/icon/Rank_Medaille03.png')]"
                    : "bg-[url('/source/icon/Rank_Medaille0.png')]"
                }`}
              >
                <b>{index + 1}</b>
              </p>
            </div>
            <div className="col-span-3 text-nowrap">
              <h1>
                [{user.ally}] {user.username}
              </h1>
            </div>
            <div className="col-span-2 row-span-2 text-center ">
              <p className="text-nowrap">{user.power.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</p>
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
                {user.kd.toFixed(2)}
              </h1>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
