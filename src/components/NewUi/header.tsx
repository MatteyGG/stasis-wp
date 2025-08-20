// components/warpath/Header.tsx
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Search, ChevronDown } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur bg-background/70">
      <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2">
        <Button variant="ghost" className="rounded-xl lg:hidden">
          <ChevronDown className="h-5 w-5" />
        </Button>
        <div className="font-semibold">Warpath • Кабинет</div>
        <div className="ml-auto flex items-center gap-2 w-full max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input className="pl-8 rounded-xl" placeholder="Поиск..." />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-xl">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl">
              {/* Контент уведомлений */}
            </DropdownMenuContent>
          </DropdownMenu>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/100?img=13" />
            <AvatarFallback>WP</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}