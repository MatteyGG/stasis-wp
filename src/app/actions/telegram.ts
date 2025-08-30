// app/actions/telegram.ts
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateTelegramRef(userId: string, tgref: string) {
  try {
    const session = await auth()
    
    // Дополнительная проверка, что пользователь обновляет свои данные
    if (!session?.user?.id || session.user.id !== userId) {
      return { error: 'Не авторизован' }
    }

    // Валидация на сервере
    if (tgref.length > 32) {
      return { error: 'Слишком длинное имя пользователя' }
    }

    // Проверяем допустимые символы
    const validRegex = /^[a-zA-Z0-9_]*$/
    if (!validRegex.test(tgref)) {
      return { error: 'Имя пользователя Telegram может содержать только буквы, цифры и подчеркивания' }
    }

    // Проверяем, не используется ли уже это имя другим пользователем
    const existingUser = await prisma.user.findFirst({
      where: {
        tgref,
        NOT: {
          id: userId
        }
      }
    })

    if (existingUser) {
      return { error: 'Это имя пользователя уже используется' }
    }

    // Обновляем данные
    await prisma.user.update({
      where: { id: userId },
      data: { tgref }
    })

    // Обновляем кэш для страницы
    revalidatePath('/profile/telegram')
    
    return { success: true }
  } catch (error) {
    console.error('Ошибка при обновлении Telegram:', error)
    return { error: 'Не удалось обновить имя пользователя Telegram' }
  }
}