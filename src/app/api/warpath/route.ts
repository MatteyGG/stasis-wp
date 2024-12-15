
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url =
    "https://yx.dmzgame.com/intl_warpath/rank_pid?day=20241205&wid=130&ccid=0&rank=power&is_benfu=1&is_quanfu=0&page=1&perPage=3000";
  const response = await fetch(url);
  if (response) {
        const data = await response.json();
        const players = data.Data.map(
          (player) =>
            ({
              ally: player.gnick,
              nick: player.nick,
              power: Number(player.power).toLocaleString(),
              sumkill: player.sumkill,
              die: player.die,
            } as const)
        );
  const  result = players.sort((a, b) => b.power - a.power)
  
  return NextResponse.json(result);
}
}