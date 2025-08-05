import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

interface Player {
  id: number;
  pid: number;
  gnick: string;
  ally: string;
  username: string;
  nick: string;
  TownHall: number;
  lv: number;
  power: number;
  kill: number;
  die: number;
  kd: number;
  sumkill: number;
  onSite: boolean;
}

export async function POST(req: NextRequest) {
  const userId = req.url.split("/").pop();

  const url = `https://yx.dmzgame.com/intl_warpath/pid_detail?pid=${userId}&page=1&perPage=1`;
  const response = await fetch(url);
  if (response) {
    const data = await response.json();
    const player = data.Data.filter((player: Player) => player.gnick === "ST").map((player: Player) =>
      prisma.serverUser.upsert({
        where: { id: Number(userId) },
        update: {
          username: player.username,
          ally: player.gnick,
          power: player.power,
          kill: player.sumkill,
          die: player.die,
          kd: parseFloat((player.sumkill / player.die).toFixed(2)),
          TownHall: player.lv,
        },
        create: {
          id: player.pid,
          ally: player.gnick,
          username: player.nick,
          power: player.power,
          kill: player.sumkill,
          die: player.die,
          kd: parseFloat((player.sumkill / player.die).toFixed(2)),
          TownHall: player.lv,
          onSite: false,
        },
      })
    );
    await Promise.all(player);
    return NextResponse.json(
      (await prisma.serverUser.findFirst({
        where: { id: Number(userId) },
      })) || {
        error: "Player not found",
      }
    );
  } else {
    return NextResponse.json({ error: "Failed to fetch data" });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.url.split("/").pop();

  try {
    const player = await prisma.serverUser.findFirst({
      where: { id: Number(userId), ally: "ST" },
    });
    return NextResponse.json(player);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch data" });
  }
}

