'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Home, Bell, Users2, Phone, Key, Camera, Settings, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils'; // Предполагается, что у вас есть утилита для условных классов

const sidebarItems = [
  { key: "home", label: "Главная", icon: Home },
  { key: "settings", label: "Профиль", icon: Users2 },
  { key: "notifications", label: "Уведомления", icon: Bell },
  { key: "social", label: "Соц. сети", icon: Users2 },
  { key: "support", label: "Поддержка", icon: Phone },
  { key: "photo", label: "Обновить фото", icon: Camera },
  { key: "password", label: "Сменить пароль", icon: Key },
  { key: "tech", label: "Сменить технику", icon: Settings },
];

export default function ProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  // Определяем текущий раздел из URL
  const segments = pathname.split('/');
  const currentSection = segments[2] || 'home';
  
  // Находим текущий раздел для отображения названия
  const currentItem = sidebarItems.find(item => item.key === currentSection) || sidebarItems[0];

  const handleNavigation = (key: string) => {
    if (key === 'home') {
      router.push('/profile');
    } else {
      router.push(`/profile/${key}`);
    }
  };

  // Автоматически сворачиваем на мобильных при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Мобильная версия */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-40">
        <div className="flex justify-between items-center p-2">
          <nav className="flex flex-1 overflow-x-auto hide-scrollbar">
            {sidebarItems.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={currentSection === key ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "h-12 w-12 mx-1 rounded-full",
                  isExpanded && "flex-row gap-2 w-auto px-3"
                )}
                onClick={() => handleNavigation(key)}
              >
                <Icon className="h-5 w-5" />
                {isExpanded && <span className="text-xs">{label}</span>}
              </Button>
            ))}
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-10 w-10 ml-2"
          >
            <ChevronRight className={cn(
              "h-5 w-5 transition-transform duration-200",
              isExpanded ? "rotate-180" : "rotate-0"
            )} />
          </Button>
        </div>
      </div>

      {/* Десктопная версия */}
      <aside className="hidden lg:flex w-54 flex-col gap-2 p-3 border-r bg-background/40">
        <div className="ml-1 gap-2 px-2 py-3">
          <div className="text-sm text-muted-foreground">Профиль</div>
          <div className="font-semibold">{currentItem.label}</div>
        </div>
        <Separator />
        <nav className="grid gap-1 mt-2">
          {sidebarItems.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={currentSection === key ? "default" : "ghost"}
              className="justify-start gap-2 rounded-2xl"
              onClick={() => handleNavigation(key)}
            >
              <Icon className="h-4 w-4" /> {label}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Отступ для мобильной навигации */}
      <div className="lg:hidden h-16" />
    </>
  );
}