// src/middleware.ts (или middleware.ts в корне)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { parse } from 'cookie'
import { prisma } from './lib/prisma'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log(`➡️ Middleware вызван для пути: ${pathname}`)

  // Проверяем, начинается ли путь с /api/user/
  if (pathname.startsWith('/api/user/')) {
    console.log('🔐 Проверяем аутентификацию для API route...')

    try {
      // Извлекаем session token из cookies
      const cookieHeader = request.headers.get('cookie') || ''
      console.log('🍪 Полученные cookies:', cookieHeader)
      
      const cookies = parse(cookieHeader)
      const sessionToken = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token']
      console.log('🔑 Извлечённый session token:', sessionToken)

      if (!sessionToken) {
        console.log('❌ Session token не найден в cookies')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Проверяем сессию в базе данных
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true }
      })

      if (!session) {
        console.log('❌ Сессия не найдена в базе данных')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (new Date(session.expires) < new Date()) {
        console.log('❌ Сессия истекла')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      console.log(`✅ Аутентификация успешна для пользователя: ${session.userId}`)

      // Добавляем информацию о пользователе в заголовки запроса
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', session.userId)

      // Продолжаем выполнение запроса с добавленными заголовками
      console.log('➡️ Передаём запрос дальше с заголовком x-user-id')
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.error('❌ Ошибка в middleware:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }

  // Для всех остальных путей продолжаем без изменений
  console.log('➡️ Путь не требует аутентификации, пропускаем...')
  return NextResponse.next()
}

// Конфигурация для указания путей, которые middleware должен обрабатывать
export const config = {
  matcher: '/api/user/:path*', // Обрабатывать все пути, начинающиеся с /api/user/
}