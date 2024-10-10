import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hidden md:flex bg-gray-800 p-2 w-full fixed bottom-0 justify-around">
        <p className="text-center">Copyright © 2023 STASIS. All rights reserved.</p>
      <ul className="flex justify-center flex-row">
        <li className="flex-col mr-6">
          <Link href="/about">About</Link>
        </li>
        <li className="mr-6">
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </footer>
  );
}
