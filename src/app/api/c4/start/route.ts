import { lastDate } from "@/lib/getDate";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { map } = await req.json();
  
  try {
    const date = await lastDate();
    const url = `https://yx.dmzgame.com/intl_warpath/rank_pid?day=${date}&wid=130&ccid=0&rank=power&is_benfu=1&is_quanfu=0&page=1&perPage=3000`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Warpath API error");
    
    const data = await response.json();
    
    // Фильтрация игроков нужного альянса
    const targetAlliance = "ST";
    const stPlayers = data.Data
      .filter((p: any) => p.gnick === targetAlliance)
      .map((p: any) => ({
        warpathId: p.pid,
        username: p.nick,
        ally: p.gnick,
        TownHall: p.lv,
        power: p.maxpower,
        kill: p.sumkill,
        die: p.die,
        kd: parseFloat((p.sumkill / (p.die || 1)).toFixed(2)),
      }));

    // Создаем новое событие C4
    const newC4 = await prisma.c4.create({
      data: {
        id: `c4_${Date.now()}`,
        map,
        status: "active",
        startedAt: new Date(),
      },
    });

    // Создаем снапшоты с возможностью последующей привязки
    const snapshots = await Promise.all(stPlayers.map(async (player) => {
      // Проверяем существование игрока в базе
      const existingPlayer = await prisma.player.findUnique({
        where: { warpathId: player.warpathId }
      });

      return prisma.playerSnapshot.create({
        data: {
          warpathId: player.warpathId,
          playerId: existingPlayer?.id || null,
          c4Id: newC4.id,
          username: player.username,
          TownHall: player.TownHall,
          power: player.power,
          kill: player.kill,
          die: player.die,
          kd: player.kd,
        }
      });
    }));

    return NextResponse.json({ ...newC4, snapshotsCount: snapshots.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to start C4: " + error.message },
      { status: 500 }
    );
  }
}