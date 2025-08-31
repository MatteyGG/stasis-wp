// components/wiki/WikiSearch.tsx
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Search } from "lucide-react";

interface WikiSearchProps {
  articles: {
    pageId: string;
    title: string;
    category: string | null;
    short: string | null;
    tags: string[];
  }[];
}

export default function WikiSearch({ articles }: WikiSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return [];
    
    return articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.short.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.some((tag: string) => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    );
  }, [searchQuery, articles]);

  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Поиск по вики..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>
      
      {searchQuery && filteredArticles.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {filteredArticles.map((article) => (
              <Link
                key={article.pageId}
                href={`/wiki/${article.category}/${article.pageId}`}
                className="block p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setSearchQuery("")}
              >
                <div className="font-medium">{article.title}</div>
                <div className="text-sm text-gray-600">{article.category}</div>
                <div className="text-xs text-gray-500">{article.short}</div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}