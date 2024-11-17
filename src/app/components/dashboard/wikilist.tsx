import { prisma } from "../../prisma";
import Link from "next/link";

export default async function WikiList() {
  const wikis = await prisma.wiki.findMany();
  return (
    <div className="container h-full min-h-64 md:h-2/3 overflow-y-scroll shadow-sm shadow-black mx-auto p-2 rounded-xl  backdrop-blur-3xl">
      <ul className="flex flex-col gap-1 ">
        {wikis.map((wiki, index) => (
          <li
            className="flex  bg-white rounded-md shadow-sm justify-between p-2"
            key={index}
          >
            <Link
              href={`wiki/${wiki.category}/${wiki.pageId}`}
              className="text-lg font-medium hover:text-blue-400"
            >
              {wiki.title}
            </Link>
            <div className="space-x-1">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl">
                Редактировать ↑
              </button>
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
