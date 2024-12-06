import { getSession } from "next-auth/react";
import { prisma } from "../prisma";

import WikiCard from "../components/wikicard";
import Memberlist from "../components/members";

export default async function Home() {
  const card_array = await prisma.wiki.findMany({
    where: { published: true },
  });
  const leader = await prisma.user.findMany({
    where: {
      rank: "leader",
    },
  });
  const officers_array = await prisma.user.findMany({
    where: { rank: { equals: "officer" } },
  });
  const members_array = await prisma.user.findMany({
    where: { rank: { in: ["R1", "R2", "R3"] } },
  });

  console.log(card_array);
  console.log(getSession);

  return (
    <>
      <div className="container shadow-2xl shadow-black mt-12 mx-auto flex flex-wrap p-4 rounded-xl ">
        <h1 className="text-6xl text-primaly text-center w-full my-6">
          <b>Welcome to STASIS</b>
        </h1>
        <div className="w-full">
          {/* Блок с случайными wiki страницами */}
          <div className="w-full ">
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

          <div className="container flex-col w-full mt-4 flex md:flex-row items-center text-primaly">
            {/* Блок с промокодами */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
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
            <div className="w-full md:w-1/3 flex flex-col mt-4 items-center">
              <h1 className="text-3xl ">
                <b>Члены альянса</b>
              </h1>
              <ul className="w-2/3 md:w-1/3 space-y-1 list-none text-center">
                {leader.map((leader, index) => (
                  <Memberlist
                    key={index}
                    role={leader.role ?? "Не найден"}
                    username={leader.username ?? "Не найден"}
                    rank={leader.rank ?? "Не найден"}
                  />
                ))}
                {Object.values(officers_array).map((member, index) => {
                  console.log(member);
                  return (
                    <Memberlist
                      key={index}
                      role={member.role ?? "Не найден"}
                      username={member.username ?? "Commander404"}
                      rank={member.rank ?? "Не найден"}
                    />
                  );
                })}
                {Object.values(members_array)
                  .sort()
                  .map((member, index) => {
                    console.log(member);
                    return (
                      <Memberlist
                        key={index}
                        role={member.role ?? "Не найден"}
                        username={member.username ?? "Commander404"}
                        rank={member.rank ?? "Не найден"}
                      />
                    );
                  })}
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
      </div>
    </>
  );
}
