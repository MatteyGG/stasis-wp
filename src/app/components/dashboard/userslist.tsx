"use client";

/* eslint-disable @next/next/no-async-client-component */
import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
  username: string;
  email: string;
  created_at: Date;
  nation: string;
  army: string;
  rank: string;
  approved: boolean;
}

export default function Userlist() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user_list", {
          method: "GET",
        });
        if (response) {
          const data = await response.json();

          setUsers(data.users);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  
  if (isLoading) {
    return (
      <form>
        <h1>Loading...</h1>
      </form>
    );
  }
  return (
    <form className="container min-h-64 shadow-sm shadow-black mx-auto flex-col p-2 rounded-xl  backdrop-blur-3xl">
      <ul className="text-left userlist  rounded-xl space-y-1">
        {Object.values(users).map((user, index) => {
          return (
            <li
              className="mx-auto px-4 bg-white rounded-xl shadow-md md:max-w-2xl"
              key={index}
            >
              <div className="flex items-center p-6 pb-1">
                <Image
                  className="rounded-md w-20 md:w-40 h-full hover:translate-x-1/2 hover:grow hover:shadow-lg hover:scale-[2.3]  transition-all delay-100 duration-500"
                  src="/placeholder.png"
                  alt=""
                  width={1000}
                  height={1000}
                />
                <div className="ml-6 w-1/2">
                  <h2
                    className={` ${user.rank} text-xl font-semibold rounded-md p-1`}
                  >
                    <select
                      className={` bg-transparent text-xl font-semibold rounded-md p-1`}
                      defaultValue={user.rank?.toString() ?? ""}
                    >
                      <option value="R1">R1</option>
                      <option value="R2">R2</option>
                      <option value="R3">R3</option>
                      <option value="officer">Officer</option>
                    </select>
                    {user.username}
                  </h2>

                  <p className="text-gray-500">
                    Создан:{" "}
                    {/* {user.created_at.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })} */}
                  </p>
                  <p className="text-gray-500">Почта: {user.email}</p>
                </div>
              </div>
              <div className="flex justify-between p-4 pt-1">
                <div className="flex flex-row">
                  <Image
                    src={"/source/nation/" + user.nation + ".webp"}
                    height={48}
                    width={48}
                    alt=""
                  />
                  <Image
                    src={"/source/army/" + user.army + ".webp"}
                    height={48}
                    width={48}
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor={"approved-" + index}
                    className="checkbox-label flex flex-row items-center gap-1"
                  >
                    <input
                      className="checkbox hidden"
                      type="checkbox"
                      id={"approved-" + index}
                    />
                    <span className="flex gap-1 checkbox-text border-b-2 border-primaly">
                      <Image
                        src={`/source/${user.approved}.svg`}
                        height={24}
                        width={24}
                        alt=""
                      />
                      <span className="">--&gt;</span>
                      <span className="">
                        <Image
                          src={`/source/${!user.approved}.svg`}
                          height={24}
                          width={24}
                          alt=""
                        />
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl">
        Подтвердить
      </button>
    </form>
  );
}
