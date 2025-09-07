// components/navbar/NotificationDropdown.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getUnreadNotifications, markAlertAsRead, markAllAlertsAsRead } from '@/app/actions/notifications';
import { toast } from 'react-toastify';
import { Alert } from '@prisma/client';

interface NotificationDropdownProps {
  userId: string;
}

export default function NotificationDropdown({ userId }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка уведомлений при открытии dropdown
  useEffect(() => {
    const loadNotifications = async () => {
      if (isOpen && userId) {
        setIsLoading(true);
        try {
          const data = await getUnreadNotifications();
          setNotifications(data);
        } catch (error) {
          console.error('Error loading notifications:', error);
          toast.error('Ошибка загрузки уведомлений');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadNotifications();
  }, [isOpen, userId]);

  // Обработчик отметки уведомления как прочитанного
  const handleMarkAsRead = async (id: number) => {
    try {
      const result = await markAlertAsRead(id);
      if (result.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast.success('Уведомление отмечено как прочитанное');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Ошибка при отметке уведомления');
    }
  };

  // Обработчик отметки всех уведомлений как прочитанных
  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllAlertsAsRead();
      if (result.success) {
        setNotifications([]);
        toast.success('Все уведомления отмечены как прочитанные');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Ошибка при отметке уведомлений');
    }
  };

  // Функция для получения варианта badge по типу уведомления
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'info': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      case 'success': return 'default';
      default: return 'outline';
    }
  };

  // Функция для получения текста badge по типу уведомления
  const getBadgeText = (type: string) => {
    switch (type) {
      case 'info': return 'Информация';
      case 'warning': return 'Предупреждение';
      case 'error': return 'Ошибка';
      case 'success': return 'Успех';
      default: return type;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-xl relative" size="icon">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl w-80">
        <div className="p-2 border-b">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Уведомления</span>
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="text-xs h-7"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Прочитать все
              </Button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-4 text-center">
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Загрузка...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className="flex flex-col items-start p-3 cursor-pointer border-b"
                onSelect={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex justify-between w-full mb-1">
                  <Badge 
                    variant={getBadgeVariant(notification.type)} 
                    className="rounded-xl text-xs"
                  >
                    {getBadgeText(notification.type)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="text-sm">{notification.message}</p>
                <span className="text-xs text-muted-foreground mt-1">
                  Нажмите, чтобы отметить как прочитанное
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Нет новых уведомлений</p>
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile/notifications" className="cursor-pointer text-center justify-center py-2">
            <Button variant="ghost" size="sm" className="w-full">
              Все уведомления
            </Button>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}