import Link from "next/link";
import { auth } from "../auth";
import SignOutButton from "./signoutButton";
import DropdownButton from "./base/dropdownButton";
import Image from "next/image";

export default async function Navbar() {
  const session = await auth();
  return (
    <>
      <nav className="flex z-0 overflow-visible flex-row justify-evenly backdrop-blur-2xl pb-2 text-center items-center">
        <div className="inline-flex items-center gap-1">
          <h1 className="inline-flex text-black p-2 rounded-lg bg-emerald-300 text-2xl ">
            <b>s130</b>
          </h1>          
          <div className="inline-flex items-center bg-pink-100 p-2 rounded-lg">
            <Image
              className="object-contain"
              src="/source/icon/flag.png"
              width={64}
              height={64}
              alt="flag"
            />
            <h1 className="text-xl ">
              <b>[ST] Стазис</b>
            </h1>
          </div>
        </div>
        {/* <Link
          className="hidden md:block text-3xl glitch"
          data-text="STASIS"
          href="/"
        >
          STASIS
        </Link> */}
        <div className="flex flex-row text-nowrap items-center">
          <ul className="flex flex-row">
            <li className="mr-6">
              <Link href="/wiki">Вики</Link>
            </li>
            <li className="mr-6">
              <Link href="/about">О нас</Link>
            </li>
          </ul>
        </div>
        <li className="z-30 absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          {session?.user ? (
            <div className="relative ml-3 space-x-1 items-center inline-flex">
              <DropdownButton>
                <Link href="/profile">Профиль</Link>
                {session?.user.role.includes("admin") ? (
                  <Link href="/dashboard">Админка</Link>
                ) : null}
                <SignOutButton color="red" />
              </DropdownButton>
            </div>
          ) : (
            <div className="space-x-1">
              <button className="bg-green-500 text-white px-3 py-1 rounded-xl hover:bg-green-600">
                <Link href="/registration">Регистрация</Link>
              </button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-xl hover:bg-blue-600">
                <Link href="/singin">Войти</Link>
              </button>
            </div>
          )}
        </li>
      </nav>
    </>
  );
}
