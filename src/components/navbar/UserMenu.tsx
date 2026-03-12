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
import { User, Settings, LogOut, MessageCircle } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import UserAvatar from "../UserAvatar";

interface UserMenuProps {
   user: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    avatarVersion?: string | null;
    username?: string | null;
    matrixMxid?: string | null;
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
const matrixWebUrl = process.env.NEXT_PUBLIC_MATRIX_WEB_URL || "https://matrix.stasis-wp.ru";
const hasMatrixAccount = Boolean(user?.matrixMxid);

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
        {hasMatrixAccount && (
          <DropdownMenuItem asChild>
            <a
              target="_blank"
              href={matrixWebUrl}
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>Открыть Matrix</span>
            </a>
          </DropdownMenuItem>
        )}
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
