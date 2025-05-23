import WikiCard from "@/app/components/wikicard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Wiki_category({
  params,
}: {
  params: {
    category: string;
  };
}) {
  const card_array = await prisma.wiki.findMany({
    where: { published: true, category: decodeURIComponent(params.category) },
  });
  return (
    <div className="container shadow-2xl shadow-black mt-12 mx-auto flex flex-wrap p-4 rounded-xl ">
      
      <div className="w-full">
        <div className="breadcrumb flat">
          <Link href="/wiki">
            <b>Wiki</b>
          </Link>
          <Link className="active" href={`../${params.category}`}>
            {decodeURIComponent(params.category)}
          </Link>
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
                link={`/wiki/${card.category}/${card.pageId}`}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
}
