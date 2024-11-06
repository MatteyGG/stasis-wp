/* eslint-disable @next/next/no-async-client-component */
'use client';

import { prisma } from "../../prisma";

import Image from "next/image";



export default async function Userlist() {
  const user_array = await prisma.user.findMany();

    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      // eslint-disable-next-line no-console
      console.log({
        email: data.get("email"),
        password: data.get("password"),
      });
    };
  return (
    <form className="container h-full md:h-4/6 shadow-sm shadow-black mx-auto flex-col p-2 rounded-xl  backdrop-blur-3xl" onSubmit={handleSubmit}>
      <ul className="h-5/6  text-left userlist overflow-y-scroll overflow-x-hidden rounded-xl space-y-1">
        {Object.values(user_array).map((user, index) => {
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
                      onChange={(e) => {
                        console.log(e.target.value);
                        prisma.user.update({
                          where: { id: user.id },
                          data: {
                            rank: e.target.value,
                          },
                        });
                      }
                    }
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
                    {user.created_at.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-500">Почта: {user.email}</p>
                </div>
              </div>
              <div className="flex justify-between p-4 pt-1">
                <div className="flex flex-row">
                  <Image
                    src={"/source/nation/" + user.nation + ".webp"}
                    height={18}
                    width={48}
                    alt=""
                  />
                  <Image
                    src={"/source/army/" + user.army + ".webp"}
                    height={18}
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
