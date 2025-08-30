// app/api/user/alerts/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // Получаем userId из заголовков, установленных middleware
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const alerts = await prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        message: true,
        createdAt: true
      }
    })

    // Кэшируем на 24 часа
    const response = NextResponse.json(alerts)
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
    return response
  } catch (error) {
    console.error('Error in alerts API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}