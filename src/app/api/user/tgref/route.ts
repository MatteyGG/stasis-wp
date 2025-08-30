// app/api/user/tgref/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  try {
    // Получаем userId из заголовков, установленных middleware
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tgref } = await req.json()

    const user = await prisma.user.update({
      where: { id: userId },
      data: { tgref },
      select: { tgref: true }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in tgref API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}