import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hidden md:flex p-2 w-full fixed bottom-0 justify-around backdrop-blur-lg">
      <p className="text-center">
        Copyright © 2025 STASIS. Сделано с ❤️ в Стасис.
      </p>
      <p>TODO:Копилка</p>
      <Link target="_blank" href="https://vk.com/stasiswp">
        <Image src="/source/icon/vk.png" width={32} height={32} alt="vk" />
      </Link>
      <ul className="flex justify-evenly flex-row items-center">
        <li className="mr-6">
          <Link href="/">Главная</Link>
        </li>
        <li className="mr-6">
          <Link href="/wiki">Wiki</Link>
        </li>
        <li className="mr-6">
          <Link href="/about">О нас</Link>
        </li>
        <li className="mr-6"></li>
      </ul>
    </footer>
  );
}
