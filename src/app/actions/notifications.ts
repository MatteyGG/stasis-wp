// app/actions/notifications.ts
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function markAllAlertsAsRead() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Не авторизован')
    }

    await prisma.alert.updateMany({
      where: { 
        userId: session.user.id,
        isRead: false
      },
      data: { isRead: true }
    })

    revalidatePath('/profile/notifications')
    return { success: true }
  } catch (error) {
    console.error('Ошибка при отметке уведомлений как прочитанных:', error)
    return { error: 'Не удалось отметить уведомления как прочитанные' }
  }
}

export async function clearAllAlerts() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Не авторизован')
    }

    await prisma.alert.deleteMany({
      where: { userId: session.user.id }
    })

    revalidatePath('/profile/notifications')
    return { success: true }
  } catch (error) {
    console.error('Ошибка при очистке уведомлений:', error)
    return { error: 'Не удалось очистить уведомления' }
  }
}

export async function deleteAlert(id: number) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Не авторизован')
    }

    // Проверяем, что уведомление принадлежит пользователю
    const alert = await prisma.alert.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!alert) {
      throw new Error('Уведомление не найдено')
    }

    await prisma.alert.delete({
      where: { id }
    })

    revalidatePath('/profile/notifications')
    return { success: true }
  } catch (error) {
    console.error('Ошибка при удалении уведомления:', error)
    return { error: 'Не удалось удалить уведомление' }
  }
}


export async function getUnreadNotifications() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }

    const alerts = await prisma.alert.findMany({
      where: { 
        userId: session.user.id,
        isRead: false
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        type: true,
        message: true,
        createdAt: true
      }
    })
    console.log(alerts)

    return alerts
  } catch (error) {
    console.error('Ошибка при получении уведомлений:', error)
    return []
  }
}

export async function markAlertAsRead(id: number) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Не авторизован')
    }

    // Проверяем, что уведомление принадлежит пользователю
    const alert = await prisma.alert.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!alert) {
      throw new Error('Уведомление не найдено')
    }

    await prisma.alert.update({
      where: { id },
      data: { isRead: true }
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Ошибка при отметке уведомления как прочитанного:', error)
    return { error: 'Не удалось отметить уведомление как прочитанное' }
  }
}