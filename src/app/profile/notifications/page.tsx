// app/profile/notifications/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationActions from "@/components/profile/notifications/NotificationActions";
import NotificationItem from "@/components/profile/notifications/NotificationItem";

export default async function NotificationsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return (
      <div className="flex flex-col p-4 md:p-6 max-w-4xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Уведомления</h1>
        <Card className="rounded-2xl">
          <CardContent className="p-6 text-center">
            <p>Необходима авторизация для просмотра уведомлений</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      type: true,
      message: true,
      createdAt: true,
      isRead: true
    }
  });

  return (
    <div className="flex flex-col p-4 md:p-6 max-w-4xl mx-auto">
      <div className=" justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Уведомления</h1>
        <NotificationActions />
      </div>

      {alerts.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-6 text-center md:p-8">
            <Bell size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">У вас нет уведомлений</h3>
            <p className="text-muted-foreground">Здесь будут появляться важные уведомления и события</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {alerts.map(alert => (
            <NotificationItem
              key={alert.id}
              id={alert.id}
              type={alert.type}
              message={alert.message}
              createdAt={alert.createdAt}
              isRead={alert.isRead}
            />
          ))}
        </div>
      )}
      
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
