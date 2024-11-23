"use client";

import { redirect } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SignOut from "../components/signoutButton";
import Alert from "../components/alert/mainalert";

import { CSSTransition } from "react-transition-group";

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
  const [reputation, setReputation] = useState(10); // Репутация
  const [alerts, setAlerts] = useState<{ type: string; message: string }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
  const [open, setOpen] = useState(false);

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
        const response = await fetch("/api/alerts/" + session!.user.id, {
          method: "GET",
        });
        if (response) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [session]);

  if (status === "unauthenticated") {
    redirect("/singin");
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const alerts_array = alerts;

  return (
    <>
      <div className="container relative -z-1 shadow-2xl shadow-black mt-12 mx-auto flex flex-wrap p-4 rounded-xl backdrop:z-0 backdrop-blur-lg">
        <h1 className="text-6xl text-primaly text-center w-full my-6">
          <b>Профиль</b>
        </h1>
        <details className="w-full">
          <summary
            className="cursor-pointer text-primaly"
            onClick={() => setOpen(!open)}
          >
            Показать уведомления
          </summary>
          <CSSTransition in={open} timeout={700} classNames="dropdown">
            <div className="dropdown-content">
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
            </div>
          </CSSTransition>
        </details>
        <div className="container w-80% flex flex-col justify-evenly md:flex-row mt-4 items-center text-primaly">
          <div className="w-full md:w-1/3 relative">
            {!session?.user?.image ? (
              <>
                <Image
                  className="z-30 rounded-md h-full hover:translate-x-1/2 hover:grow hover:shadow-lg hover:scale-[2.3] transition-all delay-100 duration-500"
                  style={{ position: "relative" }}
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
            <div className=" mt-4">
              <h4 className="text-lg font-bold text-gray-700 text-center">
                Активность
              </h4>
              <div className="w-full h-6 bg-gray-200 rounded-full my-2 relative">
                {/* Полоса прогресса */}
                <div
                  className={`h-full transition-all ${getProgressColor()}`}
                  
                  style={{
                    width: getProgressWidth(),
                    position: "relative",
                    top: 0,
                    left: 0,
                    zIndex: 10, // Полоса прогресса под текстом
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

            {/* Кнопка История изменений */}
            <div className="mt-4 text-center">
              <button
                className="bg-transparent text-blue-700 border border-blue-700 text-sm px-4 py-2 rounded-full transition-all duration-300 hover:border-blue-600 hover:text-white hover:bg-blue-600 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsModalOpen(true)}
              >
                История изменений
              </button>
            </div>

            <div className="inline-flex justify-between pt-1">
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
            <div className="w-full flex flex-col space-y-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                type="submit"
              >
                Сохранить
              </button>
              <button className="bg-amber-500 text-white px-3 py-1 rounded-md hover:bg-amber-600">
                Сбросить пароль
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
            <ul className="w-full gap-1 flex flex-col">
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
