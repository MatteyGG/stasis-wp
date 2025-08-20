// components/warpath/Sidebar.tsx
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Home, Users2, Factory, Sword, Wallet, MessagesSquare, Shield, Wrench, LibraryBig } from 'lucide-react';

interface SidebarProps {
  current: string;
  onChange: (key: string) => void;
}

const sidebarItems = [
  { key: "dashboard", label: "Главная", icon: Home },
  { key: "profile", label: "Профиль", icon: Users2 },
  { key: "base", label: "Управление базой", icon: Factory },
  { key: "army", label: "Армия и офицеры", icon: Sword },
  { key: "economy", label: "Ресурсы и экономика", icon: Wallet },
  { key: "social", label: "Социальные функции", icon: MessagesSquare },
  { key: "security", label: "Безопасность", icon: Shield },
  { key: "tech", label: "Техническая информация", icon: Wrench },
  { key: "support", label: "Поддержка", icon: LibraryBig },
];

export function Sidebar({ current, onChange }: SidebarProps) {
  return (
    <aside className="hidden lg:flex w-72 flex-col gap-2 p-3 border-r bg-background/40">
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="h-9 w-9 rounded-2xl bg-foreground/10" />
        <div>
          <div className="text-sm text-muted-foreground">Warpath</div>
          <div className="font-semibold">Личный кабинет</div>
        </div>
      </div>
      <Separator />
      <nav className="grid gap-1 mt-2">
        {sidebarItems.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={current === key ? "default" : "ghost"}
            className="justify-start gap-2 rounded-2xl"
            onClick={() => onChange(key)}
          >
            <Icon className="h-4 w-4" /> {label}
          </Button>
        ))}
      </nav>
      <div className="mt-auto p-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Советы дня</CardTitle>
            <CardDescription>Ускорь исследования в часы Буста</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full rounded-2xl">
              Подробнее
            </Button>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}