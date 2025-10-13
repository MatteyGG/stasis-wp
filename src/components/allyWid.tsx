"use client"

import Image from "next/image";
import { useState, useEffect } from "react";

interface Ally {
  fname: string;
  sname: string;
  members: number;
  power: number;
  rank: number;
}
export default function AllyWidget() {
  const [allyData, setAllyData] = useState<Ally | null>(null);

    useEffect(() => {
      async function fetchServer() {
        const response = await fetch("/api/warpath/allyinfo");
        const data = await response.json();
        setAllyData(data);
      }
      fetchServer();
    }, []);

  if (!allyData) return null;

  return (
    <ul>
      {Object.values(allyData).map((guild, index) => {
        console.log(guild);
        return (
          <li
            className="flex flex-col text-left bg-[url('/source/icon/allyinfo.png')]  bg-no-repeat items-center"
            key={index}
          >
            <span className=" w-full inline-flex items-center">
              <Image
                className="object-cover"
                src="/source/icon/allyicon.png"
                width={70}
                height={70}
                alt=""
              />
              <p className="text-2xl">
                [{guild.sname}]{guild.fname}
              </p>
            </span>
            <span className="ml-12 w-full inline-flex items-center">
              <Image
                src="/source/icon/allypower.png"
                width={32}
                height={32}
                alt=""
              />
              <b>
                <p className="ml-2">{guild.power}</p>
              </b>
            </span>
            <span className="ml-12 w-full inline-flex items-center">
              <Image
                src="/source/icon/allyLeader.png"
                width={32}
                height={32}
                alt=""
              />
              <p className="ml-2">{guild.owner}</p>
              <p className="ml-32 text-xs text-gray-600">
                Обновлено:
                {new Date(guild.created_at).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

