"use client";

import Link from "next/link";
import AlertMake from "../alert/makeAlert";

export default function main() {
  const warpathDataUpdate = async () => {
    const response = await fetch("/api/warpath/dataUpdate", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="grid grid-cols-4 gap-2 h-full min-h-64 md:h-2/3 shadow-sm shadow-black mx-auto p-4 rounded-xl  backdrop-blur-3xl">
      <button
        className=" bg-gray-200 hover:bg-gray-300 rounded-md"
        onClick={() => warpathDataUpdate()}
      >
        Обновить данные
      </button>
      <button className=" bg-gray-200 hover:bg-gray-300 rounded-md">
        <Link href="/edit">Новая статья</Link>
      </button>
      <button className=" bg-gray-200 hover:bg-gray-300 rounded-md">
        <AlertMake userId={"all"} />
        <span>Оповещение всем пользователям</span>
      </button>
    </div>
  );
}
