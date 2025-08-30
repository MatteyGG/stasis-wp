import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.url.split("/").pop();

  const url = `https://yx.dmzgame.com/intl_warpath/pid_detail?pid=${userId}&page=1&perPage=1`;
  const response = await fetch(url);
  
  if (response.ok) {
    const data = await response.json();
    
    if (data.Code === 0 && data.Data && data.Data.length > 0) {
      const player = data.Data.map((player: any) => ({
        warpathId: player.pid,
        serverId: player.wid,
        ally: player.gnick,
        nick: player.nick,
        power: Number(player.power).toLocaleString(),
        sumkill: player.sumkill,
        die: player.die,
        resourceCollection: player.caiji,
        techPower: player.powers?.tech,
        airPower: player.powers?.army_air,
        navyPower: player.powers?.army_navy,
        groundPower: player.powers?.army_ground,
      }));
      
      return NextResponse.json(player);
    } else {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}