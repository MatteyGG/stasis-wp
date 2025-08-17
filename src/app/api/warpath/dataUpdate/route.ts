import { prisma } from "@/lib/prisma";
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
  maxpower: number;
  kill: number;
  die: number;
  kd: number;
  sumkill: number;
  onSite: boolean;
}

export async function GET() {
  console.log("Starting GET request");
  const today = new Date();
  const twoDaysBefore = new Date(today.setDate(today.getDate() - 2));
  const date = twoDaysBefore.toISOString().split('T')[0].replace(/-/g, '');
  console.log("Date for API request:", date);

  const url = `https://yx.dmzgame.com/intl_warpath/rank_pid?day=${date}&wid=130&ccid=0&rank=power&is_benfu=1&is_quanfu=0&page=1&perPage=3000`;
  console.log("Fetching data from URL:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch data, status:", response.status);
      return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status });
    }

    const data = await response.json();
    console.log("Data fetched successfully\n" + JSON.stringify(data).length);

    const players = data.Data.filter((player: Player) => player.gnick === "ST").map((player: Player) => ({
      id: player.pid,
      username: player.nick,
      ally: player.gnick,
      power: player.maxpower,
      kill: player.sumkill,
      die: player.die,
      kd: parseFloat((player.sumkill / player.die).toFixed(2)),
      TownHall: player.lv,
      onSite: false,
    }));

    const upserts = players.map((player:any) =>
      prisma.player.upsert({
        where: { id: player.id },
        update: {
          username: player.nick || "",
          ally: player.ally,
          power: player.power,
          kill: player.kill,
          die: player.die,
          kd: player.kd,
          TownHall: player.TownHall,
        },
        create: {
          id: player.id,
          username: player.nick || "Unknown",
          ally: player.ally,
          power: player.power,
          kill: player.kill,
          die: player.die,
          kd: player.kd,
          TownHall: player.TownHall,
          onSite: false,
        },
      })
    );

    await Promise.all(upserts);
    console.log("Player data upserted successfully");

    console.log("Returning response:", [200, players, "Data updated successfully"]);
    return NextResponse.json([200, players, "Data updated successfully"]);
  } catch (error) {
    console.error("Error during GET request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

