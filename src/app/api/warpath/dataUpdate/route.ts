import { prisma } from "@/app/prisma";

import { NextResponse } from "next/server";
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
export async function GET() {
  const url =
    "https://yx.dmzgame.com/intl_warpath/rank_pid?day=20241205&wid=130&ccid=0&rank=power&is_benfu=1&is_quanfu=0&page=1&perPage=3000";
  const response = await fetch(url);
  if (response) {
    const data = await response.json();
    const players = data.Data.map((player: Player) =>
      prisma.serverUser.upsert({
        where: { id: player.pid },
        update: {
          username: player.username,
          ally: player.gnick,
          power: player.power,
          kill: player.kill,
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

    await Promise.all(players);
    return NextResponse.json([200, players, "Data updated successfully"]);
  }
}
