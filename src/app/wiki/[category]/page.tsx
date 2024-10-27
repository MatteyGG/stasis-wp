import WikiCard from "@/app/components/wikicard";
import { prisma } from "@/app/prisma";

export default async function Wiki_category({
  params,
}: {
  params: {
    category: string;
  };
  
}) {
  const card_array = await prisma.wiki.findMany({
    where: { published: true, category: params.category },
  });
  return (
    <div>
      Wiki of {params.category}
      <div>
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
      </div>
    </div>
  );
}