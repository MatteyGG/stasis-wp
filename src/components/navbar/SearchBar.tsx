// components/navbar/SearchBar.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative hidden md:block max-w-md w-1/4">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input className="pl-8 rounded-xl" placeholder="Поиск..." />
    </div>
  );
}