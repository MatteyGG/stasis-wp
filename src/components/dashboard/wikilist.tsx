import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Published from "./published";
import ArticleTags from "../wiki/ArticleTags";

export default async function WikiList() {
  const wikis = await prisma.wiki.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto p-4 bg-white rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Заголовок</th>
              <th className="text-left p-3">Категория</th>
              <th className="text-left p-3">Теги</th>
              <th className="text-left p-3">Автор</th>
              <th className="text-left p-3">Дата</th>
              <th className="text-left p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {wikis.map((wiki) => (
              <tr key={wiki.pageId} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <Link
                    href={`/wiki/${wiki.category}/${wiki.pageId}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                    target="_blank"
                  >
                    {wiki.title}
                  </Link>
                </td>
                <td className="p-3">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {wiki.category}
                  </span>
                </td>
                <td className="p-3">
                  <ArticleTags tags={wiki.tags as string[]} />
                </td>
                <td className="p-3 text-sm text-gray-600">{wiki.autor || "Не указан"}</td>
                <td className="p-3 text-sm text-gray-600">
                  {new Date(wiki.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <Published published={wiki.published} pageid={wiki.pageId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}