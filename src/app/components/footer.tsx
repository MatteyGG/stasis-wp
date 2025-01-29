import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hidden md:flex p-2 w-full fixed bottom-0 justify-around backdrop-blur-lg">
      <p className="text-center">
        Copyright © 2023 STASIS. All rights reserved.
      </p>
      <ul className="flex justify-center flex-row">
        <li className="flex-col mr-6">
          <Link href="/">main</Link>
        </li>
        <li className="flex-col mr-6">
          <Link href="/wiki">wiki</Link>
        </li>
        <li className="mr-6">
          <Link href="/about">about</Link>
        </li>
      </ul>
    </footer>
  );
}
