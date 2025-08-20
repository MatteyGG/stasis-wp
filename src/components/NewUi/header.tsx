'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Bell,
  Search,
  Menu,
  Home,
  BookOpen,
  Info,
  User,
  Settings,
  LogOut,
  ChartColumnIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b backdrop-blur bg-background/70">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-4">
          {/* Мобильное меню */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" >
                <Menu className="h-full" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 rounded-r-md">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Link href="/" className="flex items-center gap-2">
                    <div className=" text-black p-1 rounded-lg text-xl font-bold">
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
                      <Link href="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                        <Home className="h-4 w-4" />
                        <span>Главная</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/wiki" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                        <BookOpen className="h-4 w-4" />
                        <span>Вики</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                        <Info className="h-4 w-4" />
                        <span>О нас</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/event/c4_1755603629732" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                        <ChartColumnIcon className="h-4 w-4" />
                        <span>Статистика</span>
                      </Link>
                    </li>
                  </ul>
                </nav>

                <div className="p-4 border-t">
                  {user ? (
                    <div className="space-y-2">
                      <Link href="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                        <User className="h-4 w-4" />
                        <span>Профиль</span>
                      </Link>
                      {user.role?.includes('admin') && (
                        <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                          <Settings className="h-4 w-4" />
                          <span>Админка</span>
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-accent text-red-500"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Выход</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/registration" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                        <span>Регистрация</span>
                      </Link>
                      <Link href="/singin" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                        <span>Войти</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Логотип и название для десктопа */}
          <Link href="/" className="hidden lg:flex items-center gap-2">
            <div className=" text-black p-1 rounded-lg text-xl font-bold">
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
            <div className="relative hidden md:block max-w-md w-1/4">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8 rounded-xl" placeholder="Поиск..." />
            </div>

            {/* Уведомления */}
            {user && (
              <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-xl" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl w-80">
                  <div className="p-2 text-center text-muted-foreground">
                    Нет новых уведомлений
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Профиль пользователя */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 h-8 w-8">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || "https://i.pravatar.cc/100?img=13"} />
                      <AvatarFallback>
                        {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl w-56">
                  <div className="p-2">
                    <p className="font-medium">{user.name || 'Пользователь'}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Профиль</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role?.includes('admin') && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Админка</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 cursor-pointer focus:text-red-500"
                    onSelect={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выход</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className=" md:flex gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/registration">Регистрация</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/singin">Войти</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
