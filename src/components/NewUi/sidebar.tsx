// components/NewUi/sidebar.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Home, Users2, Factory, Sword, Wallet, MessagesSquare, Shield, Wrench, LibraryBig, Bell, Camera, Phone, Key, Settings } from 'lucide-react';

// Обновляем элементы сайдбара для профиля
const sidebarItems = [
  { key: "profile", label: "Профиль", icon: Users2 },
  { key: "notifications", label: "Уведомления", icon: Bell },
  { key: "photo", label: "Обновить фото", icon: Camera },
  { key: "contacts", label: "Контакты", icon: Phone },
  { key: "tech", label: "Сменить технику", icon: Settings },
  { key: "password", label: "Сменить пароль", icon: Key },
];

interface SidebarProps {
  current: string;
  onChange: (section: string) => void;
}

export function Sidebar({ current, onChange }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Извлекаем userId из пути
  const pathParts = pathname.split('/');
  const userId = pathParts[2];

  const handleNavigation = (key: string) => {
    onChange(key);
    // Обновляем URL без перезагрузки страницы
    router.push(`/profile/${userId}/${key}`);
  };

  return (
    <aside className="hidden lg:flex w-72 flex-col gap-2 p-3 border-r bg-background/40">
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="h-9 w-9 rounded-2xl bg-foreground/10" />
        <div>
          <div className="text-sm text-muted-foreground">Профиль</div>
          <div className="font-semibold">Настройки</div>
        </div>
      </div>
      <Separator />
      <nav className="grid gap-1 mt-2">
        {sidebarItems.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={current === key ? "default" : "ghost"}
            className="justify-start gap-2 rounded-2xl"
            onClick={() => handleNavigation(key)}
          >
            <Icon className="h-4 w-4" /> {label}
          </Button>
        ))}
      </nav>
    </aside>
  );
}