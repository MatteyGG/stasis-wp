import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import WikiSearch from "@/components/wiki/WikiSearch";
import ArticleTags from "@/components/wiki/ArticleTags";

export default async function WikiMain() {
  const categories = await prisma.wiki.groupBy({
    by: ['category'],
    where: {
      published: true,
      category: { not: null }
    },
    _count: {
      category: true
    }
  });

  const recentArticles = await prisma.wiki.findMany({
    where: { 
      published: true,
      category: { not: null }
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: {
      id: true,
      pageId: true,
      title: true,
      scr: true,
      alt: true,
      category: true,
      short: true,
      tags: true,
      createdAt: true
    }
  });

  const allArticles = await prisma.wiki.findMany({
    where: { published: true },
    select: {
      pageId: true,
      title: true,
      category: true,
      short: true,
      tags: true
    }
  });

  return (
    <div className="flex flex-col p-0 md:p-6 max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wiki</h1>
      </div>

      {/* Компонент поиска */}
      <WikiSearch articles={allArticles} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Категории</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {categories.map((category) => (
              <Link 
                key={category.category} 
                href={`/wiki/${category.category}`}
                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100"
              >
                <span className="font-medium">{category.category}</span>
                <Badge variant="secondary" className="rounded-xl">
                  {category._count.category} статей
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Последние статьи</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/wiki/${article.category}/${article.pageId}`}
                className="flex gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                {article.scr && (
                  <Image
                    src={article.scr}
                    alt={article.alt || ""}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.short}
                  </p>
                  <ArticleTags tags={article.tags || []} className="mt-2" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Популярные теги</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleTags 
            tags={Array.from(new Set(recentArticles.flatMap(article => article.tags || [])))
              .slice(0, 10)} 
          />
        </CardContent>
      </Card>
    </div>
  );
}