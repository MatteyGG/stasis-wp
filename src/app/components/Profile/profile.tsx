import SignOut from "@/app/components/signoutButton";
import Alert from "@/app/components/alert/mainalert";
import { useEffect, useState } from "react";
import Image from "next/image";
import WikiCard from "../wikicard";

import React from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllyWidget from "../allyWid";

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};
const wikicardData = [
  {
    title: "Sample Wiki 1",
    category: "Army",
    description: "This is a description for Sample Wiki 1.",
    img: { src: "sample1.jpg", alt: "Sample Image 1" },
    link: "/wiki/category-a/sample-wiki-1",
  },
  {
    title: "Sample Wiki 2",
    category: "Tech",
    description: "This is a description for Sample Wiki 2.",
    img: { src: "sample2.jpg", alt: "Sample Image 2" },
    link: "/wiki/category-b/sample-wiki-2",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Profile({
  session,
  status,
  alerts_array,
}: {
  session: any;
  status: string;
  alerts_array: [];
}) {
  const notify = () =>
    toast.success("Скопировано", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const getProgressWidth = () => {
    if (reputation > 0) return `${(reputation / 10) * 100}%`;
    if (reputation < 0) return `${(Math.abs(reputation) / 5) * 100}%`;
    return "0%";
  };

  const getProgressColor = () => {
    if (reputation > 0) return "bg-green-500";
    if (reputation < 0) return "bg-red-500";
    return "bg-gray-300";
  };

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [army, setArmy] = useState("");
  const [nation, setNation] = useState("");
  const [rank, setRank] = useState("");
  const [created_at, setCreated_at] = useState<Date>(new Date());

  const [wikicard, setWikicard] = useState([]);

  const [approved, setApproved] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reputation, setReputation] = useState(10); // Репутация

  useEffect(() => {
    if (status === "authenticated" && session.user) {
      setUserId(session.user.id);
      setUsername(session.user.username);
      setEmail(session.user.email);
      setArmy(session.user.army);
      setNation(session.user.nation);
      setRank(session.user.rank);
      setCreated_at(session.user.created_at);
      setApproved(session.user.approved);
      setWikicard(wikicardData);
    }
  }, [session, status]);

  return (
    <>
      <div className="container w-full bg-gray-200 bg-opacity-55 p-4 shadow-2xl shadow-black mx-auto rounded-3xl">
        <div className="grid grid-cols-3">
          <div className="z-2 relative w-full justify-center ">
            {!session?.user?.image ? (
              <div className="mx-auto w-10/12 place-items-center">
                <div className="">
                  <Image
                    className="z-20 object-none aspect-[3/2] rounded-3xl hover:object-cover hover:translate-x-1/2 hover:grow hover:shadow-lg hover:scale-[2.3] transition-all delay-100 duration-500"
                    style={{
                      position: "relative",
                      zIndex: 3, // Полоса прогресса под текстом
                    }}
                    src={
                      "/userScreen/" + "userScreen_" + session!.user.id + ".png"
                    }
                    alt={username}
                    width={700}
                    height={700}
                  />
                </div>
              </div>
            ) : (
              <>
                <label>
                  <input
                    className="hidden"
                    type="file"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files[0]) {
                        console.log(files[0]);
                      }
                    }}
                  />
                  <span className="block border border-primary rounded-lg p-2 text-xs text-center">
                    Загрузить фото
                  </span>
                </label>
              </>
            )}
            <div className="mt-4 items-center pb-1">
              <div className="text-xl w-10/12 justify-center mx-auto">
                <div className="flex flex-col ">
                  <div
                    className={` ${rank} flex flex-row justify-between text-nowrap text-xl p-3 font-semibold rounded-md`}
                  >
                    <div>
                      <span className="uppercase">{rank}</span>:
                      <span className="capitalize">{username}</span>
                    </div>
                    <Image
                      src={`/source/${approved}.svg`}
                      height={24}
                      width={24}
                      alt=""
                    />
                  </div>
                  <p className="text-gray-500">
                    Создан:{" "}
                    {new Date(created_at).toLocaleDateString("ru-RU", options)}
                  </p>
                  <p className="text-gray-500">Почта: {email}</p>
                  <div className="inline-flex  pt-1">
                    <Image
                      src={"/source/nation/" + nation + ".webp"}
                      height={64}
                      width={64}
                      alt=""
                    />
                    <Image
                      src={"/source/army/" + army + ".webp"}
                      height={64}
                      width={64}
                      alt=""
                    />
                  </div>
                </div>
                <div className="mt-2 mb-2">
                  <h1>Контакты</h1>
                  <Image
                    src="/source/icon/telegram.png"
                    height={64}
                    width={64}
                    alt="Telegram"
                  />
                </div>
                <div className="flex w-full">
                  <SignOut color="gray" />
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <ul className="w-full gap-2 flex flex-col">
              {alerts_array &&
                Object.values(alerts_array).map((alert, index) => {
                  const alertType = alert.type.toString().toLowerCase();
                  if (
                    alertType === "info" ||
                    alertType === "warning" ||
                    alertType === "error" ||
                    alertType === "success"
                  ) {
                    return (
                      <Alert
                        key={index}
                        type={
                          alertType as "info" | "warning" | "error" | "success"
                        }
                        message={alert.message}
                      />
                    );
                  } else {
                    console.error(`Invalid alert type: ${alertType}`);
                    return null;
                  }
                })}
            </ul>
            <div className=" mt-4">
              <div className="w-full h-6 bg-gray-200 rounded-full my-2 ">
                {/* Полоса прогресса */}
                <div
                  className={`h-full transition-all rounded-lg ${getProgressColor()}`}
                  style={{
                    width: getProgressWidth(),
                    position: "relative",
                    top: 0,
                    left: 0,
                    zIndex: 0, // Полоса прогресса под текстом
                  }}
                ></div>

                {/* Текст */}
                <div
                  className=" inset-0 flex items-center justify-center text-sm font-bold"
                  style={{
                    zIndex: 20, // Текст поверх полосы прогресса
                  }}
                >
                  {reputation > 0 || reputation < 0
                    ? `${Math.abs(reputation) * 10}%`
                    : "0%"}
                </div>
              </div>
            </div>
            <div>
              <div className="w-full flex flex-col items-center mt-8">
                <h1 className="text-3xl">
                  <b>Промокоды</b>
                </h1>
                <ul className="mt-2 list-none list-inside grid grid-cols-1 md:grid-cols-2 gap-2">
                  {["wpcommunity", "WPIAGG", "QUOCKHANHVN"].map((code) => (
                    <li
                      className="inline-flex bg-slate-200 text-black p-2 rounded-lg"
                      key={code}
                    >
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(code);
                          notify();
                        }}
                      >
                        <Image
                          src="/source/icon/copy.png"
                          width={24}
                          height={24}
                          alt=""
                        />
                      </button>
                      <b className="ml-2 text-center mt-1">{code}</b>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mx-6">
            <div className="w-full">
              <h1 className="text-3xl my-2">Рекомендации</h1>
              <section className="grid grid-cols-3 gap-4 text-white">
                {Object.values(wikicard).map((card, index) => {
                  console.log(card);
                  return (
                    <WikiCard
                      key={index} // assuming each card has a unique id
                      title={card.title ?? "Туториал"}
                      category={card.category ?? ""}
                      description={card.short ?? ""}
                      img={{ src: "Liberty.webp", alt: "" }}
                      link={`wiki/${card.category}/${card.pageId}`}
                    />
                  );
                })}
              </section>
            </div>
            <AllyWidget />
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
          theme="colored"
        />
      </div>
    </>
  );
}
