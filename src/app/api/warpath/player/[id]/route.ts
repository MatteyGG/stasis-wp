import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

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
export async function GET(req: NextRequest) {
  const userId = req.url.split("/").pop();

  const url = `https://yx.dmzgame.com/intl_warpath/pid_detail?pid=${userId}&page=1&perPage=1`;
  const response = await fetch(url);
  if (response) {
    const data = await response.json();
    const player = data.Data.map(
      (player: Player) =>
        ({
          ally: player.gnick,
          nick: player.nick,
          power: Number(player.power).toLocaleString(),
          sumkill: player.sumkill,
          die: player.die,
        } as const)
    );
    return NextResponse.json(player);
  } else {
    return NextResponse.json({ error: "Failed to fetch data" });
  }
}
