import Link from "next/link";
import { auth } from "../auth";
import SignOutButton from "./signoutButton";

export default async function Navbar() {

  const session = await auth()
  return (
    <>
      <nav className="flex overflow-visible flex-row justify-evenly backdrop-blur-2xl mt-1 pb-2 text-center items-center">
        <Link className="text-3xl glitch" data-text="STASIS" href="/">
          STASIS
        </Link>
        <div className="flex flex-row items-center">
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
        <li className="list-none justify-end">
          {session?.user ? (
              <div className="space-x-1">
                <Link href="/profile">Профиль</Link>
                <SignOutButton />
              </div>
            ) : (
              <div className="space-x-1">
                <Link href="/singin">Войти</Link>
              </div>
            )
          }
        </li>
      </nav>
    </>
  );
}
