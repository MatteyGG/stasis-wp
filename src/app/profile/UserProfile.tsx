"use client";

import { redirect } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SignOut from "../components/signoutButton";
import Alert from "../components/alert/mainalert";

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export default function UserProf() {
  const { data: session, status } = useSession();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [army, setArmy] = useState("");
  const [nation, setNation] = useState("");
  const [rank, setRank] = useState("");
  const [created_at, setCreated_at] = useState<Date>(new Date());

  const [approved, setApproved] = useState(false);
  const [reputation, setReputation] = useState(8); // Репутация
  const [alerts, setAlerts] = useState<{ type: string; message: string }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
  const [changeHistory, setChangeHistory] = useState([
    { date: "2024-11-01", change: "Изменение имени на 'JohnDoe'" },
    { date: "2024-11-10", change: "Обновлена почта на 'johndoe@example.com'" },
    // Здесь могут быть реальные данные истории изменений
  ]);

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

  useEffect(() => {
    if (status === "authenticated" && session.user) {
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
    (async () => {
      try {
        const response = await fetch("/api/listAlerts", {
          method: "GET",
        });
        if (response) {
          const data = await response.json();
          setAlerts(data.alerts);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  if (status === "unauthenticated") {
    redirect("/singin");
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const alerts_array = alerts;

  return (
    <>
      <div className="container shadow-2xl shadow-black mt-12 mx-auto flex flex-wrap p-4 rounded-xl backdrop-blur-md">
        <h1 className="text-6xl text-primaly text-center w-full my-6">
          <b>Профиль</b>
        </h1>
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
                  type={alertType as "info" | "warning" | "error" | "success"}
                  message={alert.message}
                />
              );
            } else {
              console.error(`Invalid alert type: ${alertType}`);
              return null;
            }
          })}
        <div className="container w-80% flex flex-col justify-evenly md:flex-row mt-4 items-center text-primaly">
          <div className="w-full md:w-1/3 relative">
            {!session?.user?.image ? (
              <>
                <Image
                  className="rounded-md h-full hover:translate-x-1/2 hover:grow hover:shadow-lg hover:scale-[2.3] transition-all delay-100 duration-500"
                  src={"/placeholder.png"}
                  alt={username}
                  width={1000}
                  height={1000}
                />
                <label>
                  <input className="hidden" type="file" />
                  <span className="block border border-gray-800 rounded-b-md p-2 text-xs text-center">
                    Изменить
                  </span>
                </label>
              </>
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
            {/* Обновление изображения без перекрытия */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none"></div>
          </div>

          <div className="h-full text-2xl w-full md:w-1/3 pt-4">
            <div className=" items-center pb-1">
              <div className="text-xl">
                <div
                  className={` ${rank} flex flex-row justify-between text-nowrap text-xl p-3 font-semibold rounded-md`}
                >
                  <div>
                    <span className="uppercase">{rank}</span>:
                    <input
                      className="border-transparent bg-transparent w-1/2"
                      defaultValue={username}
                    />
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
              </div>
            </div>

{/* Репутация */}
<div className="mt-4">
  <h4 className="text-lg font-bold text-gray-700 text-center">
    Активность
  </h4>
  <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden my-2 relative">
    {/* Полоса прогресса */}
    <div
      className={`h-full transition-all ${getProgressColor()}`}
      style={{
        width: getProgressWidth(),
        position: "absolute", // Полоса прогресса остаётся внутри контейнера
        top: 0,
        left: 0,
        zIndex: 1, // Полоса прогресса под текстом
      }}
    ></div>

    {/* Текст */}
    <div
      className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold"
      style={{
        zIndex: 2, // Текст поверх полосы прогресса
      }}
    >
      {reputation > 0 || reputation < 0
        ? `${Math.abs(reputation) * 10}%`
        : "0%"}
    </div>
  </div>
</div>


{/* Кнопка История изменений */}
<div className="mt-4 text-center">
  <button
    className="bg-transparent text-blue-700 border border-blue-700 text-sm px-4 py-2 rounded-full transition-all duration-300 hover:border-blue-600 hover:text-white hover:bg-blue-600 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    onClick={() => setIsModalOpen(true)}
  >
    История изменений
  </button>
</div>







            <div className="flex justify-between pt-1">
              <div className="flex flex-row">
                <Image
                  src={"/source/nation/" + nation + ".webp"}
                  height={48}
                  width={48}
                  alt=""
                />
                <Image
                  src={"/source/army/" + army + ".webp"}
                  height={48}
                  width={48}
                  alt=""
                />
              </div>
            </div>
            <div className="w-full">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                type="submit"
              >
                Сохранить
              </button>
              <SignOut />
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно Истории изменений */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">История изменений</h2>
            <ul>
              {changeHistory.map((item, index) => (
                <li key={index} className="mb-2">
                  <b>{item.date}:</b> {item.change}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={() => setIsModalOpen(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
