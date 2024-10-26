"use client";

import { redirect } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SignOut from "../components/signoutButton";

export default function UserProf() {
  const { data: session, status } = useSession();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [army, setArmy] = useState("");
  const [nation, setNation] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session.user) {
      setUsername(session.user.username);
      setEmail(session.user.email);
      setArmy(session.user.army);
      setNation(session.user.nation);

      console.log("use session", session);
    }
  }, [session, status]);

  if (status === "unauthenticated") {
    redirect("/singin");
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  async function handeleProfileUpdate(e) {
    e.preventDefault();
    console.log("submit");
    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        army: army,
        nation: nation,
      }),
    });
  }

  return (
    <>
      <div className="container shadow-2xl shadow-black mt-12 mx-auto flex flex-wrap p-4 rounded-xl  backdrop-blur-md">
        <h1 className="text-6xl text-primaly text-center w-full my-6">
          <b>Профиль</b>
        </h1>
        <div className="container w-80% flex mt-4 items-center text-primaly">
          <div className=" md:w-1/3 ">
            {!session.user?.image ? (
              <>
                <Image
                  className=" rounded-t-md object-cover w-full"
                  src={"/placeholder.jpg"}
                  alt={username}
                  width={128}
                  height={128}
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
                    onChange={(e) => console.log(e.target.files[0])}
                  />
                  <span className="block border border-primary rounded-lg p-2 text-xs text-center">
                    Загрузить фото
                  </span>
                </label>
              </>
            )}
          </div>
          <div className="h-full w-auto md:w-2/3">
            <form
              className="grow max-w-sm h-max mx-12 rounded-sm grid grid-cols-1 "
              onSubmit={handeleProfileUpdate}
            >
              <input
                type="email"
                readOnly={true}
                disabled={true}
                value={email}
                placeholder="podgoroy@example.com"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={username}
              />
              <div className="flex flex-row justify-center">
                <Image
                  src={"/" + army + ".webp"}
                  alt={army}
                  width={64}
                  height={64}
                />
                <Image
                  src={"/" + nation + ".webp"}
                  alt={nation}
                  width={64}
                  height={64}
                />
              </div>
              <button
                className="bg-green-500
                text-white
                px-3
                py-1
                rounded-md
                hover:bg-green-600
                "
                type="submit"
              >
                Сохранить
              </button>
              <SignOut />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
