import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <nav className="flex flex-row justify-evenly backdrop-blur-2xl pb-2 text-center items-center">
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
          <Link href="/login">Войти</Link>
        </li>
      </nav>
    </>
  );
}
