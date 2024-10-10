import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-2">
      <ul className="flex justify-center flex-row">
        <li className="flex-col mr-6">
          <Link href="/">
            Home
          </Link>
        </li>
        <li className="mr-6">
          <Link href="/about">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
