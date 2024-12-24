"use client";

import React from "react";
import { signOut } from "next-auth/react";

const colorVariants = {
  blue: "bg-blue-600 hover:bg-blue-500 text-white",
  red: "bg-red-500 hover:bg-red-400 text-white",
  yellow: "bg-yellow-300 hover:bg-yellow-400 text-black",
  gray: "bg-gray-700 hover:bg-gray-600 text-white",
}

export default function SignOutButton( {color}: {color: keyof typeof colorVariants} ) {
  return (
    <button
      className={`${colorVariants[color]} px-3 py-1 rounded-md hover:bg-${color}-600 w-full`}
      onClick={() => signOut()}
    >
      Выход
    </button>
  );
}

