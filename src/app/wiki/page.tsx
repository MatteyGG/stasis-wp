import WikiCard from "@/app/components/wikicard";
import { prisma } from "../prisma";
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
    <div className="container shadow-2xl shadow-black mt-12 mx-auto flex flex-wrap p-4 rounded-xl ">
      <h1 className="text-6xl text-primaly text-center w-full my-6">
        <b>Wiki</b>
      </h1>
      <div className="w-full">
        {/* Блок с wiki страницами */}
        <div className="w-full">
          <div className="inline-flex gap-2">
            {card_category.map((category) => (
              <button
                key={category.category}
                className="bg-gray-400 text-primaly text-md px-3 py-1 rounded-xl mb-1"
              >
                <Link href={`wiki/${category.category}`}>
                  {category.category}
                </Link>
              </button>
            ))}
          </div>

          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 text-white">
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
      </div>
    </div>
  );
}
