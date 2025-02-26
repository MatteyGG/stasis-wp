import WikiCard from "@/app/components/wikicard";
import { prisma } from "../../lib/prisma";
import Link from "next/link";

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

      <section className="grid grid-cols-2 md:grid-cols-10 gap-4 text-white">
        {Object.values(card_array).map((card, index) => {
          return (
            <WikiCard
              key={index} // assuming each card has a unique id
              title={card.title ?? "Туториал"}
              category={card.category ?? ""}
              description={card.short ?? ""}
              img={{ src: card.scr, alt: card.alt ?? "" }}
              link={`wiki/${card.category}/${card.pageId}`}
            />
          );
        })}
      </section>
    </div>
  );
}
