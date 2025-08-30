// components/navbar/NavBar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import NotificationDropdown from './NotificationDropdown';
import UserMenu from './UserMenu';

interface NavBarProps {
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export default function NavBar({ user }: NavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur bg-background/70">
      <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-4">
        {/* Мобильное меню */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-full" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 rounded-r-md">
            <MobileMenu user={user} onClose={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Логотип и название для десктопа */}
        <Link href="/" className="hidden lg:flex items-center gap-2">
          <div className="text-black p-1 rounded-lg text-xl font-bold">
            s130
          </div>
          <div className="hidden md:flex items-center">
            <Image
              src="/source/icon/flag.png"
              width={32}
              height={32}
              alt="flag"
              className="mr-2"
            />
            <span className="text-xl font-bold">[ST] Стазис</span>
          </div>
        </Link>

        {/* Навигационные ссылки для десктопа */}
        <nav className="hidden lg:flex items-center gap-6 ml-4">
          <Link href="/wiki" className="hover:text-primary font-medium">Вики</Link>
          <Link href="/about" className="hover:text-primary font-medium">О нас</Link>
        </nav>

        <div className="flex-1 flex items-center gap-2 justify-end">
          {/* Поиск */}
          <SearchBar />

          {/* Уведомления */}
          {user && <NotificationDropdown userId={user.id!} />}

          {/* Профиль пользователя */}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}