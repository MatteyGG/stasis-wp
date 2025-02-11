import { prisma } from "@/app/prisma";
import Image from "next/image";
import AlertMake from "../alert/makeAlert";

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export default async function Manage_users() {
  const users_array = await prisma.user.findMany();

  return (
    <ul className="h-5/6 min-h-64 grid grid-cols-1  md:grid-cols-3 text-left  rounded-xl space-y-1">
      {Object.values(users_array).map((user, index) => {
        return (
          <li
            className="mx-auto px-4 ease-in-out duration-300 bg-white rounded-xl shadow-md md:max-w-2xl"
            key={index}
          >
            <div className="flex items-center p-0 md:p-6 ">
              <Image
                className="rounded-md w-20 md:w-40 h-full hover:translate-x-1/2 hover:grow hover:shadow-lg hover:scale-[2.3]  transition-all delay-100 duration-500"
                src={"/userScreen/" + "userScreen_" + user.id + ".png"}
                alt=""
                width={1000}
                height={1000}
              />
              <div className="ml-6 w-full md:w-1/2">
                <div
                  className={` ${user.rank} flex flex-row justify-between  text-nowrap text-xl p-3 font-semibold rounded-md`}
                >
                  <div>
                    <span className="uppercase">{user.rank}</span>:
                    <input
                      className="border-transparent bg-transparent w-1/2"
                      defaultValue={user.username!}
                    />
                  </div>
                  <Image
                    src={`/source/${user.approved}.svg`}
                    height={24}
                    width={24}
                    alt=""
                  />
                </div>
                <div className="text-base">
                  <p className="text-gray-500">
                    Создан:{" "}
                    {user.created_at.toLocaleDateString("ru-RU", options)}
                  </p>
                  <p className="text-gray-500">Почта: {user.email}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between p-4 pt-1">
              <div className="inline-flex">
                <Image
                  src={"/source/nation/" + user.nation + ".webp"}
                  width={48}
                  height={48}
                  alt=""
                />
                <Image
                  src={"/source/army/" + user.army + ".webp"}
                  width={48}
                  height={48}
                  alt=""
                />
              </div>
              <AlertMake userId={user.id.toString()} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
