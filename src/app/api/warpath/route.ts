
import { NextResponse } from "next/server";
interface Player {
  gnick: string;
  username: string;
  power: string;
  ally: string;
  kills: string;
  death: string;
  nick: string;
  sumkill: number;
  die: number;
}
export async function GET() {
  const url =
    "https://yx.dmzgame.com/intl_warpath/rank_pid?day=20241205&wid=130&ccid=0&rank=power&is_benfu=1&is_quanfu=0&page=1&perPage=3000";
  const response = await fetch(url);
  if (response) {
        const data = await response.json();
        const players = data.Data.map(
          (player: Player) =>
            ({
              ally: player.gnick,
              nick: player.nick,
              power: Number(player.power).toLocaleString(),
              sumkill: player.sumkill,
              die: player.die,
            } as const)
        );
  const  result = players.sort((a: { power: number; }, b: { power: number; }) => b.power - a.power)
  
  return NextResponse.json(result);
}
}