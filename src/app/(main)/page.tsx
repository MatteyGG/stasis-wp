import { prisma } from "../../lib/prisma";

import Memberlist from "../components/members";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PromocodeItem from "../components/promocodes";
import WikiContainer from "../components/wiki/wikicontainer";
import C4Container from "../components/c4/c4container";


export default async function Home() {
  const card_array = await prisma.wiki.findMany({
    where: { published: true },
    orderBy: {
      createdAt: "desc",
    },
  });
  const leader = await prisma.user.findMany({
    where: {
      rank: "leader",
    },
    select: {
      rank: true,
      username: true,
      role: true,
    },
  });
  const officers_array = await prisma.user.findMany({
    where: { rank: { equals: "officer" } },
    select: {
      rank: true,
      username: true,
      role: true,
    },
  });
  const members_array = await prisma.user.findMany({
    where: { rank: { in: ["R1", "R2", "R3"] } },
    select: {
      rank: true,
      username: true,
      role: true
    },
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/promocode`
  );
  const promocodes = await response.json();
  const sortedPromocodes = [...promocodes.data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const currentC4 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/c4`)
    .then((res) => res.json())
    .then((data) => data.c4);

  return (
    <>
      <div className="container shadow-2xl shadow-black mt-12 mx-auto flex flex-wrap p-4 rounded-xl ">
        <div className="w-full ">
          {/* Блок с случайными wiki страницами */}
          <div className="w-full ">
            <WikiContainer card_array={card_array}/>
          </div>

          <div className="container flex-col w-full mt-4 flex md:flex-row items-center text-primaly">
            {/* Блок с промокодами */}
            <div className="w-full md:w-1/3 flex flex-col items-center mt-8">
              <h1 className="text-3xl">
                <b>Промокоды</b>
              </h1>

              <ul className="mt-2 list-none list-inside grid grid-cols-1 md:grid-cols-2 gap-2">
                {sortedPromocodes.slice(0, 10).map((promocode, index) => (
                  <PromocodeItem key={index} promocode={promocode} />
                ))}
              </ul>
            </div>
            {/* Блок с членами альянса */}
            <div className="w-full md:w-1/3 flex flex-col mt-4 items-center justify-center">
              <h1 className="text-3xl ">
                <b>Члены альянса</b>
              </h1>
              <ul className="flex flex-col w-2/3 md:w-full space-y-1 justify-center items-center text-center">
                {leader.map((leader, index) => (
                  <Memberlist
                    key={index}
                    role={leader.role ?? "X"}
                    username={leader.username ?? "Не найден"}
                    rank={leader.rank ?? "X"}
                  />
                ))}
                {Object.values(officers_array).map((member, index) => {
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
                <b>Сражение</b>
              </h1>
              <C4Container {...currentC4} />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

