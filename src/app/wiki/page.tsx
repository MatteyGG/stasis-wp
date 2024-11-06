import WikiCard from "@/app/components/wikicard";
import { prisma } from "../prisma";

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
    <div className="container shadow-2xl shadow-black mt-12 mx-auto flex flex-wrap p-4 rounded-xl  backdrop-blur-3xl">
      <h1 className="text-6xl text-primaly text-center w-full my-6">
        <b>Wiki</b>
      </h1>
      <div className="w-full">
        {/* Блок с wiki страницами */}
        <div className="w-full ">
            <button>
              {card_category.map((category) => (
                <span key={category.category}>{category.category}</span>
              ))}
            </button>
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 text-white">
            {Object.values(card_array).map((card, index) => {
              console.log(card);
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
