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

export async function POST() {
  const activeC4 = await prisma.c4.findFirst({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
  });

  if (!activeC4) {
    return NextResponse.json({ error: "No active C4 found" }, { status: 404 });
  }

  try {
    // Получаем свежие данные с Warpath API
    const today = new Date();
    const twoDaysBefore = new Date(today.setDate(today.getDate() - 2));
    const date = twoDaysBefore.toISOString().split("T")[0].replace(/-/g, "");
    const url = `https://yx.dmzgame.com/intl_warpath/rank_pid?day=${date}&wid=130&ccid=0&rank=power&is_benfu=1&is_quanfu=0&page=1&perPage=3000`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Warpath API error");
    
    const data = await response.json();
    
    // Фильтруем только игроков ST
    const stPlayers = data.Data
      .filter((p: WarpathPlayer) => p.gnick === "ST")
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

    // Обновляем статус C4
    const finishedC4 = await prisma.c4.update({
      where: { id: activeC4.id },
      data: {
        status: "finished",
        endedAt: new Date(),
      },
    });

    // Создаем финальные снапшоты
    const snapshots = stPlayers.map(player => 
      prisma.playerSnapshot.create({
        data: {
          ...player,
          c4Id: finishedC4.id,
          playerId: player.id,
        }
      })
    );

    await Promise.all(snapshots);

    return NextResponse.json(finishedC4);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to finish C4: " + error.message },
      { status: 500 }
    );
  }
}