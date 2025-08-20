// app/warpath/dashboard/page.tsx
import { WarpathCard, ResourceTile, NewsTile } from '@/components/NewUi/newcomp';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Sword, TrendingUp, Factory, Users2 } from 'lucide-react';

// Мок-данные
const news: NewsTileProps[] = [
  { title: " ", body: " ", time: "1 час назад" },
  { title: " ", body: " ", time: "2 часа назад" },
  { title: " ", body: " ", time: "3 часа назад" },
];

const units = [
  {
    id: 1,
    name: " ",
    level: 1,
    hp: 100,
    attack: 10,
    defense: 5,
  },
  {
    id: 2,
    name: " ",
    level: 2,
    hp: 150,
    attack: 20,
    defense: 10,
  },
];

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Контент страницы с использованием компонентов */}
      <WarpathCard>
        {/* ... */}
        <ResourceTile title="Золото" value="12,450" />
        {/* ... */}
      </WarpathCard>
      
      <WarpathCard>
        {news.map(item => (
          <NewsTile key={item.id} {...item} />
        ))}
      </WarpathCard>
    </div>
  );
}