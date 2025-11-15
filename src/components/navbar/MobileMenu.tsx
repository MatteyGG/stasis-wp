// components/navbar/MobileMenu.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  BookOpen,
  Info,
  ChartColumnIcon,
  User,
  Settings,
  LogOut,
  Swords,
  Gift,
} from 'lucide-react';
import { signOut } from "next-auth/react";

interface MobileMenuProps {
  user: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
  onClose: () => void;
}

export default function MobileMenu({ user, onClose }: MobileMenuProps) {
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
          <div className="text-black p-1 rounded-lg text-xl font-bold">
            s130
          </div>
          <div className="flex items-center">
            <Image
              src="/source/icon/flag.png"
              width={32}
              height={32}
              alt="flag"
              className="mr-2"
            />
            <span className="text-lg font-bold">Стазис</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent" onClick={handleLinkClick}>
              <Home className="h-4 w-4" />
              <span>Главная</span>
            </Link>
          </li>
          <li>
            <Link href="/wiki" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent" onClick={handleLinkClick}>
              <BookOpen className="h-4 w-4" />
              <span>Вики</span>
            </Link>
          </li>
          <li>
            <Link href="/about" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent" onClick={handleLinkClick}>
              <Info className="h-4 w-4" />
              <span>О нас</span>
            </Link>
          </li>
          <li>
            <Link href="/c4" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent" onClick={handleLinkClick}>
              <Swords className="h-4 w-4"/>
              <span>Сражения</span>
            </Link>
          </li>
          <li>
            <Link href="/statistics" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent" onClick={handleLinkClick}>
              <ChartColumnIcon className="h-4 w-4" />
              <span>Статистика</span>
            </Link>
          </li>
          <li>
            <Link href="/promocodes" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent" onClick={handleLinkClick}>
             <Gift className="h-4 w-4"/>
              <span>Промокоды</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t">
        {user ? (
          <div className="space-y-2">
            <Link href="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent" onClick={handleLinkClick}>
              <User className="h-4 w-4" />
              <span>Профиль</span>
            </Link>
            {user.role?.includes('admin') && (
              <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent" onClick={handleLinkClick}>
                <Settings className="h-4 w-4" />
                <span>Админка</span>
              </Link>
            )}
            <button
              onClick={() => {
                signOut();
                handleLinkClick();
              }}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-accent text-red-500"
            >
              <LogOut className="h-4 w-4" />
              <span>Выход</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link href="/registration" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent" onClick={handleLinkClick}>
              <span>Регистрация</span>
            </Link>
            <Link href="/singin" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent" onClick={handleLinkClick}>
              <span>Войти</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}