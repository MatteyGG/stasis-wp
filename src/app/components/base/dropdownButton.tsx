'use client'
import { useState } from "react";
import Image from "next/image";

export interface DropdownButtonProps {
  children: React.ReactNode;
}

export default function DropdownButton({ children }: DropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-20 ml-3 ">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="relative flex rounded-full text-sm"
          id="user-menu-button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <span className="absolute -inset-1.5"></span>
          <Image
            className=" rounded-full"
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