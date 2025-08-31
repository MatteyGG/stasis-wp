import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/wiki/Breadcrumbs";
import ArticleTags from "@/components/wiki/ArticleTags";

export default async function WikiCategory({ params }: { params: { category: string } }) {
  const decodedCategory = decodeURIComponent(params.category);
  const articles = await prisma.wiki.findMany({
    where: { 
      published: true, 
      category: decodedCategory 
    },
    orderBy: { title: 'asc' },
    select: {
      id: true,
      pageId: true,
      title: true,
      scr: true,
      alt: true,
      category: true,
      short: true,
      tags: true
    }
  });

  return (
    <div className="flex flex-col p-0 md:p-6 max-w-full">
      {/* Хлебные крошки */}
      <Breadcrumbs category={decodedCategory} />
      
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{decodedCategory}</h1>
        <Badge variant="secondary" className="rounded-xl">
          {articles.length} статей
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="rounded-2xl overflow-hidden">
            {article.scr && (
              <Image
                src={article.scr}
                alt={article.alt || ""}
                width={300}
                height={160}
                className="w-full h-40 object-cover"
              />
            )}
            <CardHeader>
              <CardTitle className="text-lg">{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {article.short}
              </p>
              <ArticleTags tags={article.tags || []} className="mb-4" />
              <Link
                href={`/wiki/${article.category}/${article.pageId}`}
                className="text-blue-500 hover:underline text-sm"
              >
                Читать подробнее →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}