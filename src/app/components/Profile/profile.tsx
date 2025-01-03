/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import SignOut from "@/app/components/signoutButton";
import Alert from "@/app/components/alert/mainalert";
import { useEffect, useState } from "react";
import Image from "next/image";

import React from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllyWidget from "../allyWid";

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Profile({ session, status, alerts_array }: {
  session: any;
  status: string;
  alerts_array:{ type: string; message: string }[];
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
  const [promocodes, setPromocodes] = useState<
    { id: number; code: string; createdAt: string; until: string }[]
  >([]);

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
    }
  }, [session, status]);
  useEffect(() => {
    fetch("/api/promocode")
      .then((res) => res.json())
      .then((data) => {
        setPromocodes(data.data);
        console.log(data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const sortedPromocodes = [...promocodes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const isRecent = (date: Date) => {
    const now = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(now.getDate() - 3);

    // Check if the date is within the last 3 days
    return date >= threeDaysAgo && date <= now;
  };

  return (
    <>
      <div className="container w-full bg-gray-200 bg-opacity-55 p-4 shadow-2xl shadow-black mx-auto rounded-3xl">
        <div className="grid grid-cols-3">
          <div className="z-2 relative w-full justify-center ">
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
                  {sortedPromocodes.slice(0, 10).map((promocode, index) => (
                    <li
                      className={`inline-flex text-black p-2 rounded-lg ${
                        isRecent(new Date(promocode.createdAt))
                          ? "bg-green-300"
                          : "bg-blue-300"
                      }`}
                      key={index}
                    >
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(promocode.code);
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
                      <b className="ml-2 text-center mt-1">{promocode.code}</b>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mx-6">
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
