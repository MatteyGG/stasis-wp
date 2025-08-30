// components/notifications/NotificationItem.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Loader2 } from 'lucide-react'
import { deleteAlert } from '@/app/actions/notifications'
import { toast } from 'react-toastify'

interface NotificationItemProps {
  id: number
  type: string
  message: string
  createdAt: Date
  isRead: boolean
}

export default function NotificationItem({ 
  id, 
  type, 
  message, 
  createdAt, 
  isRead 
}: NotificationItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'info': return 'default'
      case 'warning': return 'secondary'
      case 'error': return 'destructive'
      case 'success': return 'default'
      default: return 'outline'
    }
  }

  const getBadgeText = (type: string) => {
    switch (type) {
      case 'info': return 'Информация'
      case 'warning': return 'Предупреждение'
      case 'error': return 'Ошибка'
      case 'success': return 'Успех'
      default: return type
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteAlert(id)
    setIsDeleting(false)
    
    if (!result.success) {
      toast.error(result.error)
    }
  }

  return (
    <Card className={`rounded-2xl ${isRead ? 'opacity-70' : ''}`}>
      <CardContent className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-3">
          <Badge 
            variant={getBadgeVariant(type)} 
            className="rounded-xl mb-2"
          >
            {getBadgeText(type)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
        <p className="text-base">{message}</p>
        <div className="flex justify-end mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-xl gap-2"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <X size={16} />
            )}
            Скрыть
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}