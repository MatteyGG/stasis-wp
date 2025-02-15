import { prisma } from "../../prisma";
import Link from "next/link";
import Published from "./published";

export default async function WikiList() {
  const wikis = await prisma.wiki.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="container h-max min-h-64 overflow-y-scroll shadow-sm shadow-black mx-auto p-2 rounded-xl  backdrop-blur-3xl">
      <ul className="flex flex-col gap-1 ">
        {wikis.map((wiki, index) => (
          <li
            className="flex  bg-white rounded-md shadow-sm justify-between p-2"
            key={index}
          >
            <div className="flex flex-col md:flex-row md:inline-flex items-baseline gap-1 md:gap-6">
              <Link
                href={`/wiki/${wiki.pageId}`}
                className="text-sm text-left md:text-lg font-medium hover:text-blue-400"
              >
                {wiki.title}
              </Link>
              <span className="text-sm text-gray-500">{wiki.category} </span>
              <span className="text-sm text-gray-500">{wiki.autor} </span>
              <span className="text-sm text-gray-500">
                {new Date(wiki.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="inline-flex items-center">
              <Published published={wiki.published} pageid={wiki.pageId} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
