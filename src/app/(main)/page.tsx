import { getSession } from "next-auth/react";
import WikiCard from "../components/wikicard";
import { prisma } from "../prisma";

export default async function Home() {
    const card_array = await prisma.wiki.findMany({
      where: { title: { not: null } },
    });
  console.log(card_array)
  console.log(getSession);

  return (
    <>
      <div className="container shadow-2xl shadow-black mt-12 mx-auto flex flex-wrap p-4 rounded-xl  backdrop-blur-3xl text-white">
        <h1 className="text-6xl text-primaly text-center w-full my-6">
          <b>Welcome to STASIS</b>
        </h1>
        {/* Блок с случайными wiki страницами */}
        <div className="w-full ">
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {Object.values(card_array).map((card, index) => {
              console.log(card);
              return (
                <WikiCard
                  className="w-min"
                  key={index} // assuming each card has a unique id
                  title={card.title}
                  category={card.category}
                  description={card.short}
                  img={{ src: "/placeholder.jpg", alt: "some_image_alt" }}
                  link={"/"}
                />
              );
            })}
          </section>
        </div>

        <div className="container w-full mt-4 flex flex-row items-center text-primaly">
          {/* Блок с промокодами */}
          <div className="w-1/3 flex flex-col items-center">
            <h1 className="text-3xl">
              <b>Промокоды</b>
            </h1>
            <ul className="list-disc list-inside">
              <li>
                <b>wpcommunity</b>
              </li>
              <li>
                <b>WPIAGG</b>
              </li>
              <li>
                <b>QUOCKHANHVN</b>
              </li>
            </ul>
          </div>
          {/* Блок с членами альянса */}
          <div className="w-1/3 flex flex-col mt-4 items-center">
            <h1 className="text-3xl ">
              <b>Члены альянса</b>
            </h1>
            <ul className="list-none list-inside text-center space-y-1 ">
              <li className=" rounded-full px-4 py-1 text bg-slate-400  backdrop-blur-3xl bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500">
                <b>Лидер: Mafon</b>
              </li>
              <li className="border border-black rounded-full px-4 py-1 text bg-slate-400  backdrop-blur-3xl">
                <b>Лидер: Mafon</b>
              </li>
              <li className="border border-black rounded-full px-4 py-1 text-black bg-slate-400  backdrop-blur-3xl">
                <b>Дипломат: Герань</b>
              </li>
              <li className="border border-black rounded-full px-4 py-1 text bg-slate-400  backdrop-blur-3xl">
                <b>Леха</b>
              </li>
            </ul>
          </div>
          {/* Блок с уведомлениями */}
          <div className="w-full  md:w-1/3 flex flex-col mt-4 items-center ">
            <h1 className="text-3xl ">
              <b>Уведомления</b>
            </h1>
            <ul className=" list-inside">
              <li>Нет новых сообщений</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
