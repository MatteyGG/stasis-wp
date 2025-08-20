
import WikiCard from "@/components/wikicard";
import { prisma } from "../lib/prisma";

export default async function WikiEXample() {
  const card_array = await prisma.wiki.findMany({
    where: { published: true },
  });
  return (
    <div className="container shadow-2xl shadow-black mt-12 mx-auto flex flex-wrap p-4 rounded-xl ">
      <h1 className="text-6xl text-primaly text-center w-full my-6">
        <b>Wiki</b>
      </h1>
      <div className="w-full">
          <section className="grid grid-cols-2 gap-4 text-white">
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
  );
}
