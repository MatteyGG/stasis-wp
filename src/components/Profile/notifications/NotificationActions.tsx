// components/notifications/NotificationActions.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, Trash2, Loader2 } from 'lucide-react'
import { markAllAlertsAsRead, clearAllAlerts } from '@/app/actions/notifications'
import { toast } from 'react-toastify'

export default function NotificationActions() {
  const [isMarking, setIsMarking] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const handleMarkAllRead = async () => {
    setIsMarking(true)
    const result = await markAllAlertsAsRead()
    setIsMarking(false)
    
    if (result.success) {
      toast.success("Все уведомления отмечены как прочитанные")
    } else {
      toast.error(result.error)
    }
  }

  const handleClearAll = async () => {
    setIsClearing(true)
    const result = await clearAllAlerts()
    setIsClearing(false)
    
    if (result.success) {
      toast.success("Все уведомления удалены")
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-xl gap-2"
        onClick={handleMarkAllRead}
        disabled={isMarking}
      >
        {isMarking ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <CheckCircle size={16} />
        )}
        Отметить все как прочитанные
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-xl gap-2"
        onClick={handleClearAll}
        disabled={isClearing}
      >
        {isClearing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Trash2 size={16} />
        )}
        Очистить все
      </Button>
    </div>
  )
}