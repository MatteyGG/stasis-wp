// components/navbar/UserMenu.tsx
'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from "next-auth/react";

interface UserMenuProps {
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const avatarImage = user ? `https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userProfile/${user.id}.png` : "/source/help/unit-placeholder";

  if (!user) {
    return (
      <div className="md:flex gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/registration">Регистрация</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/singin">Войти</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full p-0 h-8 w-8">
          <Avatar className="h-8 w-8">
            <Image
              className="rounded-full object-cover border-2 border-gray-300"
              src={avatarImage}
              alt={user.name || 'User Avatar'}
              width={128}
              height={128}
            />
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
  );
}