// app/settings/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateTech from '@/components/profile/UpdateTech';
import AvatarUpload from '@/components/profile/AvatarUpload';

export default async function SettingsPage() {
  const session = await auth();
  
  console.log('⚙️ Settings page - Session:', session ? {
    user: {
      id: session.user.id,
      username: session.user.username,
      techSlots: session.user.techSlots
    }
  } : 'No session');

  if (!session?.user) {
    redirect('/login');
  }

  const { user } = session;

  return (
    <div className="flex flex-col p-3 sm:p-4 md:p-6 max-w-6xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">Настройки профиля</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Левая колонка - аватар и основная информация */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          <Card className="rounded-lg md:rounded-xl">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg">Аватар профиля</CardTitle>
            </CardHeader>
            <CardContent>
              <AvatarUpload
                userId={user.id}
                username={user.username}
              />
            </CardContent>
          </Card>

          <Card className="rounded-lg md:rounded-xl">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg">Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Имя пользователя</p>
                <p className="text-sm md:text-base">{user.username}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Игровой ID</p>
                <p className="text-sm md:text-base">{user.gameID || 'Не привязан'}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Роль</p>
                <p className="text-sm md:text-base">{user.role}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Количество техники</p>
                <p className="text-sm md:text-base">
                  {user.techSlots ? `Количество: ${user.techSlots.length}` : 'Не найдены'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - настройки техники */}
        <div className="lg:col-span-2">
          <Card className="rounded-lg md:rounded-xl">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg">Настройки техники</CardTitle>
              <CardDescription>
                Выберите технику для каждого слота (5 наземных юнитов, 3 авиации, 3 морских юнита)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateTech 
              
                initialTechSlots={user.techSlots || []} 
                id={user.id} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ToastContainer position="bottom-center" />
    </div>
  );
}