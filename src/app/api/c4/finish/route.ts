import { lastDate } from "@/lib/getDate";
import { prisma } from "@/lib/prisma";
import { WarpathPlayer } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST() {
  const activeC4 = await prisma.c4.findFirst({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
  });

  if (!activeC4) {
    return NextResponse.json({ error: "No active C4 found" }, { status: 404 });
  }

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
        power: p.maxpower,
        kill: p.sumkill,
        die: p.die,
        kd: parseFloat((p.sumkill / (p.die || 1)).toFixed(2)),
      }));

    // Создаем финальные снапшоты
    const snapshots = await Promise.all(stPlayers.map(async (player) => {
      const existingPlayer = await prisma.player.findUnique({
        where: { warpathId: player.warpathId }
      });

      return prisma.playerSnapshot.create({
        data: {
          warpathId: player.warpathId,
          playerId: existingPlayer?.id || null,
          username: player.username,
          c4Id: activeC4.id,
          power: player.power,
          kill: player.kill,
          die: player.die,
          kd: player.kd,
        }
      });
    }));

    // Получаем начальную статистику
    const statistics = await prisma.c4Statistic.findMany({
      where: { c4Id: activeC4.id }
    });

    // Рассчитываем прирост показателей
    let totalPowerGain = 0;
    let totalKillGain = 0;
    let totalDieGain = 0;
    let totalKdGain = 0;
    let playerCount = 0;

    for (const stat of statistics) {
      const finalPlayer = stPlayers.find((p: WarpathPlayer) => p.warpathId === stat.warpathId);
      
      if (finalPlayer) {
        const powerGain = finalPlayer.power - stat.startPower;
        const killGain = finalPlayer.kill - stat.startKill;
        const dieGain = finalPlayer.die - stat.startDie;
        const kdGain = finalPlayer.kd - stat.startKd;
        
        totalPowerGain += powerGain;
        totalKillGain += killGain;
        totalDieGain += dieGain;
        totalKdGain += kdGain;
        playerCount++;

        // Обновляем статистику
        await prisma.c4Statistic.update({
          where: { id: stat.id },
          data: {
            powerGain,
            killGain,
            dieGain,
            kdGain
          }
        });
      }
    }

    // Обновляем агрегированные данные в C4
    const finishedC4 = await prisma.c4.update({
      where: { id: activeC4.id },
      data: {
        status: "finished",
        endedAt: new Date(),
        totalPlayers: playerCount,
        avgPowerGain: playerCount > 0 ? totalPowerGain / playerCount : 0,
        avgKillGain: playerCount > 0 ? totalKillGain / playerCount : 0,
        avgDieGain: playerCount > 0 ? totalDieGain / playerCount : 0,
        avgKdGain: playerCount > 0 ? totalKdGain / playerCount : 0,
      },
    });

    // Очищаем временные снапшоты
    await prisma.playerSnapshot.deleteMany({
      where: { c4Id: activeC4.id }
    });

    return NextResponse.json({ ...finishedC4, snapshotsCount: snapshots.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to finish C4: " + error.message },
      { status: 500 }
    );
  }
}