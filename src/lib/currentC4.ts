// lib/c4.ts
import { prisma } from './prisma';

export async function getCurrentC4() {
  if (typeof window === 'undefined') {
    return await prisma.c4.findFirst({
      orderBy: { createdAt: "desc" },
      take: 1,
    }) || { status: "none" };
  }
  
  // Если на клиенте, используем API-запрос
  try {
    const response = await fetch('/api/c4/current');
    return await response.json();
  } catch (error) {
    console.error('Error fetching current C4:', error);
    return { status: "none" };
  }
}