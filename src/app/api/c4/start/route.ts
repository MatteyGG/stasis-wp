import { lastDate } from "@/lib/getDate";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface WarpathPlayer {
  pid: number;
  nick: string;
  gnick: string;
  lv: number;
  maxpower: number;
  sumkill: number;
  die: number;
}

export async function POST(req: Request) {
  const { map } = await req.json();
  
  try {
    const date = await lastDate();
    console.log("Date for API request:", date);
    const url = `https://yx.dmzgame.com/intl_warpath/rank_pid?day=${date}&wid=130&ccid=0&rank=power&is_benfu=1&is_quanfu=0&page=1&perPage=3000`;
    console.log("Fetching data from URL:", url);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Warpath API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Проверка структуры ответа
    if (!data.Data || !Array.isArray(data.Data)) {
      throw new Error("Invalid API response structure");
    }
    
    console.log(`Data fetched successfully. Total players: ${data.Data.length}`);
    
    // ИЩЕМ ПРАВИЛЬНОЕ НАЗВАНИЕ АЛЬЯНСА
    // Выводим уникальные названия альянсов для отладки
    const alliances = Array.from(new Set(data.Data.map((p: WarpathPlayer) => p.gnick)));
    console.log("Found alliances:", alliances);
    
    // Фильтруем игроков нужного альянса 
    const targetAlliance = "ST"; // Измените на актуальное название
    const stPlayers = data.Data
      .filter((p: WarpathPlayer) => p.gnick === targetAlliance)
      .map((p: WarpathPlayer) => ({
        id: p.pid,
        username: p.nick,
        ally: p.gnick,
        TownHall: p.lv,
        power: p.maxpower,
        kill: p.sumkill,
        die: p.die,
        kd: parseFloat((p.sumkill / (p.die || 1)).toFixed(2)),
      }));

    console.log(`Filtered players for ${targetAlliance}: ${stPlayers.length}`);
    
    // Создаем новое событие C4
    const newC4 = await prisma.c4.create({
      data: {
        map,
        status: "active",
        startedAt: new Date(),
      },
    });
    console.log("Created C4 event:", newC4.id);

    // Создаем снапшоты
    const snapshots = stPlayers.map(player => 
      prisma.playerSnapshot.create({
        data: {
          ...player,
          c4Id: newC4.id,
          playerId: player.id,
        }
      })
    );

    await Promise.all(snapshots);
    console.log(`Created ${snapshots.length} player snapshots`);

    return NextResponse.json(newC4);
  } catch (error: any) {
    console.error("Error in POST /api/c4/start:", error);
    return NextResponse.json(
      { error: "Failed to start C4: " + error.message },
      { status: 500 }
    );
  }
}