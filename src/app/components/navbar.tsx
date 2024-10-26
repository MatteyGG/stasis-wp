import Link from "next/link";
import { auth } from "../auth";
import SignOutButton from "./signoutButton";

export default async function Navbar() {

  const session = await auth()
  return (
    <>
      <nav className="flex overflow-visible flex-row justify-evenly backdrop-blur-2xl mt-1 pb-2 text-center items-center">
        <Link className="hidden md:block text-3xl glitch" data-text="STASIS" href="/">
          STASIS
        </Link>
        <div className="flex flex-row text-nowrap items-center">
          <ul className="flex flex-row">
            <li className="mr-6">
              <Link href="/wiki">Вики</Link>
            </li>
            <li className="mr-6">
              <Link href="/about">В работе</Link>
            </li>
            {session?.user.role.includes("admin") ? (
              <li className="mr-6">
                <Link href="/dashboard">Админка</Link>
              </li>
            ) : null}
          </ul>
        </div>
        <li className=" list-none justify-end">
          {session?.user ? (
            <div className="space-x-1">
              <Link href="/profile">Профиль</Link>
              <SignOutButton />
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
