import { prisma } from "../../lib/prisma";
import Link from "next/link";
import WikiContainer from "../components/wiki/wikicontainer";

export default async function WikiMain() {
  const card_category = await prisma.wiki.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });
  const card_array = await prisma.wiki.findMany({
    where: { published: true },
  });
  return (
    <div className="flex flex-col justify-center shadow-2xl shadow-black mt-12 mx-auto p-4 rounded-xl ">
      {/* Блок с wiki страницами */}
      <div className="mx-auto divide-x-2 divide-neutral-700 mb-2  shadow-lg overflow-hidden rounded-[5px]">
        {card_category.map((category) => (
          <button
            key={category.category}
            className="
    px-4 py-2 text-sm text-gray-200 bg-[#333]
    first:rounded-l-[5px]
    last:rounded-r-[5px]
    transition-all duration-700
    hover:bg-[#3b5998] hover:after:bg-[#3b5998]"
          >
            <Link href={`wiki/${category.category}`}>{category.category}</Link>
          </button>
        ))}
      </div>
        <WikiContainer card_array={card_array} />

    </div>
  );
}
