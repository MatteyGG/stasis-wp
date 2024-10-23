"use client";

import React from "react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600"
        onClick={() => signOut()}
      >
        Выход
      </button>
    </>
  );
}
