// components/profile/NotificationButtons.tsx
'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'

interface NotificationButtonsProps {
  userId: string
}

export default function NotificationButtons({ userId }: NotificationButtonsProps) {
  const TgInGameNotify = async (type: string) => {
    const cooldownTime = 300000 // 5 minutes
    const lastNotification = localStorage.getItem(`inGameNotify-${userId}`)
    
    if (lastNotification && Date.now() - Number(lastNotification) < cooldownTime) {
      toast.error("Вы не можете отправлять уведомление слишком часто")
      return
    }
    
    localStorage.setItem(`inGameNotify-${userId}`, Date.now().toString())
    
    const response = await fetch('/api/alerts/ingame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, userId }),
    })
    
    const data = await response.json()
    console.log(data)
  }

  return (
    <>
      <Button className="w-full" onClick={() => TgInGameNotify('info')}>
        Начать сбор группы
      </Button>
      <Button className="w-full" onClick={() => TgInGameNotify('warning')}>
        Тревожная кнопка
      </Button>
      <Button className="w-full" onClick={() => TgInGameNotify('officer')}>
        Вызвать офицера
      </Button>
    </>
  )
}