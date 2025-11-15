// components/navbar/UserMenu.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, PhoneCall } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import UserAvatar from "../UserAvatar";

const DEFAULT_USERNAME = 'Guest';
const DEFAULT_USER_ID = '0';
const DEFAULT_AVATAR_VERSION = 'ver';

interface UserMenuProps {
   user: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    avatarVersion?: string | null;
    username?: string | null;
  } | null;
}


export default function UserMenu({ user }: UserMenuProps) {
  if (!user || user==null) {
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
const fallbackUser = {
  id: DEFAULT_USER_ID,
  username: DEFAULT_USERNAME,
  avatarVersion: DEFAULT_AVATAR_VERSION,
};

const safeUser = user ? { ...fallbackUser, ...user } : fallbackUser;

const VideoCallString = `https://rtc.stasis-wp.ru/join?room=stasiswp&roomPassword=false&audio=0&video=0&name=${encodeURIComponent(
  safeUser.username || "",
)}&avatar=https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userProfile/${safeUser.id}.png?v=${safeUser.avatarVersion}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full p-0 h-8 w-8">
          <UserAvatar
            userId={user.id || ""}
            username={user.username || ""}
            version={user.avatarVersion || ""}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl w-56">
        <div className="p-2">
          <p className="font-medium">{user.username || "Пользователь"}</p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Профиль</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            target="_blank"
            href={VideoCallString}
            rel="noopener noreferrer"
          >
            <PhoneCall className="mr-2 h-4 w-4" />
            <span>Голосовой чат</span>
          </a>
        </DropdownMenuItem>
        {user.role?.includes("admin") && (
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
