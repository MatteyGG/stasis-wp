import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import remarkFlexibleContainers from "remark-flexible-containers";
import remarkVideo from "remark-video";
import Breadcrumbs from "@/components/wiki/Breadcrumbs";
import ArticleTags from "@/components/wiki/ArticleTags";
import { ViewCounter } from "@/components/wiki/ViewCounter";
import { RecentViewers } from "@/components/wiki/RecentViewers";
import { auth } from '@/lib/auth';
import Link from "next/link";

const options = {
  mdxOptions: {
    remarkPlugins: [
      remarkGfm,
      remarkToc,
      remarkFlexibleContainers,
      remarkVideo,
    ],
    rehypePlugins: [],
  },
};

export default async function WikiPage(props: { params: Promise<{ category: string; wikipageid: string }> }) {
  const params = await props.params;
  const session = await auth();
  const article = await prisma.wiki.findUnique({
    where: { pageId: params.wikipageid },
    select: {
      id: true,
      pageId: true,
      title: true,
      category: true,
      md: true,
      tags: true,
      autor: true,
      views: true,
      likes: true,
      createdAt: true
    }
  });

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <Card className="rounded-2xl max-w-md text-center">
          <CardHeader>
            <CardTitle>Страница не найдена</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Запрошенная статья не существует или была удалена
            </p>
            <Link href="/wiki" className="text-blue-500 hover:underline">
              Вернуться в Wiki
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Увеличиваем счетчик просмотров
  await prisma.wiki.update({
    where: { pageId: article.pageId },
    data: { views: { increment: 1 } }
  });

  // Записываем просмотр только для авторизованных пользователей
  if (session?.user) {
    // Проверяем, был ли недавний просмотр от этого пользователя (в течение 5 минут)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const recentView = await prisma.wikiView.findFirst({
      where: { 
        wikiPageId: article.pageId,
        userId: session.user.id,
        viewedAt: {
          gte: fiveMinutesAgo
        }
      }
    });

    // Если не было просмотра в последние 5 минут, создаем новую запись
    if (!recentView) {
      await prisma.wikiView.create({
        data: {
          wikiPageId: article.pageId,
          userId: session.user.id,
          username: session.user.username || "Пользователь",
          viewedAt: new Date()
        }
      });
    }
  }

  // Получаем последних просмотревших (только авторизованных пользователей)
  const recentViewers = await prisma.wikiView.findMany({
    where: { 
      wikiPageId: article.pageId,
    },
    orderBy: { viewedAt: 'desc' },
    take: 5,
    select: {
      id: true,
      userId: true,
      username: true,
      viewedAt: true,
    }
  });

  return (
    <div className="flex flex-col p-0 md:p-6 max-w-4xl mx-auto">
      <Breadcrumbs category={article.category || ''} title={article.title || ''} />

      <Card className="rounded-2xl">
        <CardHeader>
          <ArticleTags tags={article.tags || []} className="mb-4" />
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <ViewCounter views={article.views + 1} /> {/* +1 потому что мы уже увеличили счетчик */}
            {article.autor && <span>Автор: {article.autor}</span>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <MDXRemote source={article.md || ''} options={options} />
          </div>
          
          {/* Блок с последними просмотревшими (только авторизованные) */}
          <RecentViewers viewers={recentViewers} />
          
          <div className="flex items-center justify-between mt-8 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Опубликовано: {new Date(article.createdAt).toLocaleDateString('ru-RU')}
            </div>
            <div className="text-sm text-muted-foreground">
              Лайков: {article.likes}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}