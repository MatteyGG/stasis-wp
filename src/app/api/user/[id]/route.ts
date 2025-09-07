// app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Получаем данные пользователя из базы данных с помощью Prisma
    const userData = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        username: true,
        rank: true,
        tgref: true,
        created_at: true,
        approved: true,
        
      },
    });
    
    if (!userData) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}