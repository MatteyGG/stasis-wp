import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex px-12 justify-between border-t pt-4 pb-2 w-full  text-xs text-muted-foreground">
      <p className="text-center">
        Copyright © 2025 STASIS. Сделано с ❤️ в Стазис.
      </p>
      <Link target="_blank" href="https://boosty.to/matteygg/donate">
        Поддержать разработчика✌️
      </Link>
    </footer>
  );
}
