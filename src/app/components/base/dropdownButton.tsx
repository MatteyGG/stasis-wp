'use client'
import { useState } from "react";
import Image from "next/image";

export default function DropdownButton({ children } ) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative ml-3 overflow-y-visible z-20">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          id="user-menu-button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <span className="absolute -inset-1.5"></span>
          <span className="sr-only">Open user menu</span>
          <Image
            className="size-8 rounded-full"
            src="/source/icon/Stasis_logo.png"
            width={64}
            height={64}
            alt=""
          />
        </button>
      </div>
      {isOpen && (
        <div className="absolute right-0 z-30 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="flex flex-col text-center divide-y">{children}</div>
        </div>
      )}
    </div>
  );
}