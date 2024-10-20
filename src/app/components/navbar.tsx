import Link from "next/link";
import { auth } from "../auth";

export default async function Navbar() {

  const session = await auth()
  console.log(session?.user)
  return (
    <>
      <nav className="flex overflow-visible flex-row justify-evenly backdrop-blur-2xl pb-2 text-center items-center">
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
          </ul>
        </div>
        <li className="list-none justify-end">
          {session?.user ? (
              <>
                <Link href="/profile">Профиль</Link>
              </>
            ) : (
                <Link href="/singin">Войти</Link>
            )
          }
        </li>
      </nav>
    </>
  );
}
