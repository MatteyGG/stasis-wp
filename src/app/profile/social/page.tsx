// app/profile/social/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TelegramForm from '@/components/profile/social/TelegramForm';

export default async function TelegramPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return (
      <div className="flex flex-col p-4 md:p-6 max-w-4xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Настройки Telegram</h1>
        <Card className="rounded-2xl">
          <CardContent className="p-6 text-center">
            <p>Необходима авторизация для изменения настроек Telegram</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Получаем актуальные данные пользователя
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tgref: true }
  });

  return (
    <div className="flex flex-col p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Настройки Telegram</h1>
      
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Ссылка на Telegram</CardTitle>
          <CardDescription>
            Укажите ваше имя пользователя в Telegram для получения уведомлений
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TelegramForm 
            currentTgRef={user?.tgref || ''} 
            userId={session.user.id} 
          />
        </CardContent>
      </Card>
      
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