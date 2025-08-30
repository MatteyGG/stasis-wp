import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// app/api/userUpdate/route.ts
export const POST = async (req: Request) => {
  const prisma = new PrismaClient();
  try {
    const { id, groundUnits, airUnits, navalUnits } = await req.json();
    console.log('Received data:', { id, groundUnits, airUnits, navalUnits });

    // Удаляем существующие слоты техники пользователя
    await prisma.userTechSlot.deleteMany({
      where: { userId: id }
    });

    // Создаем массив всех слотов
    const allSlots = [
      ...groundUnits.map((slot: any, index: number) => ({
        userId: id,
        type: 'ground',
        slotIndex: index,
        nation: slot.nation,
        unit: slot.unit
      })),
      ...airUnits.map((slot: any, index: number) => ({
        userId: id,
        type: 'air',
        slotIndex: index,
        nation: slot.nation,
        unit: slot.unit
      })),
      ...navalUnits.map((slot: any, index: number) => ({
        userId: id,
        type: 'naval',
        slotIndex: index,
        nation: slot.nation,
        unit: slot.unit
      }))
    ].filter(slot => slot.nation !== null && slot.unit !== null); // Фильтруем пустые слоты

    console.log('Slots to save:', allSlots);

    // Сохраняем все слоты
    if (allSlots.length > 0) {
      await prisma.userTechSlot.createMany({
        data: allSlots
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating user tech slots:", error);
    return NextResponse.json(
      { error: "Failed to update user tech slots" },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
};