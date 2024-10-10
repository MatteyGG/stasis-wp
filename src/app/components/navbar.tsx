import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex flex-row justify-around backdrop-blur-2xl pb-2 text-center items-center">
      <span className="text-3xl glitch" data-text="STASIS">STASIS</span>
      <div className="flex flex-row items-center">
      <ul className="flex flex-row">
        <li className="flex-col mr-6">
          <Link href="/">Главная</Link>
        </li>
        <li className="mr-6">
          <Link href="/about">Вики</Link>
        </li>
        <li className="mr-6">
          <Link href="/about">В работе</Link>
        </li>
      </ul>
      <div className="flex flex-row gap-0">
      <button className="bg-gray-100 rounded-l-xl p-2">
        <Link href="/login">Войти</Link>
      </button>
      <button className="bg-white rounded-r-xl p-2">
        <Link href="/profile">Зарегестрироваться</Link>
      </button>
      </div>
      </div>
    </nav>
  );
}
