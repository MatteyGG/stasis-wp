import { prisma } from "../../prisma";
import Link from "next/link";

export default async function WikiList() {
  const wikis = await prisma.wiki.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="container h-full min-h-64 md:h-2/3 overflow-y-scroll shadow-sm shadow-black mx-auto p-2 rounded-xl  backdrop-blur-3xl">
      <ul className="flex flex-col gap-1 ">
        {wikis.map((wiki, index) => (
          <li
            className="flex  bg-white rounded-md shadow-sm justify-between p-2"
            key={index}
          >
            <div className="inline-flex items-baseline  gap-6">
              <Link
                href={`/wiki/${wiki.pageId}`}
                className="text-lg font-medium hover:text-blue-400"
              >
                {wiki.title}
              </Link>
              <span className="text-sm text-gray-500">{wiki.category}</span>
              <span className="text-sm text-gray-500">
                {new Date(wiki.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="space-x-1">
              <Link
                href={`/edit/?pageid=${wiki.pageId}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl"
              >
                Редактировать ↑
              </Link>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-xl">
                Опубликовать{" ->"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
