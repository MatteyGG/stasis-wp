import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { playerId, warpathId } = await req.json();
  
  try {
    // Обновляем все снапшоты игрока
    await prisma.playerSnapshot.updateMany({
      where: { warpathId },
      data: { playerId }
    });

    // Обновляем основную запись игрока
    const player = await prisma.player.update({
      where: { id: playerId },
      data: { warpathId },
      include: { snapshots: true }
    });

    return NextResponse.json({
      success: true,
      updatedSnapshots: player.snapshots.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to bind snapshots: " + error.message },
      { status: 500 }
    );
  }
}