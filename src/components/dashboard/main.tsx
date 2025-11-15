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
    <div className="grid grid-cols-4 gap-2 h-full min-h-64 md:h-2/3 shadow-sm shadow-black mx-auto p-4 rounded-xl backdrop-blur-3xl">
      <button
        className="bg-gray-200 hover:bg-gray-300 rounded-md"
        onClick={warpathDataUpdate}
      >
        Обновить данные
      </button>
      <Link
        className="bg-gray-200 hover:bg-gray-300 rounded-md"
        href="/edit"
        passHref
      >
        <button className="h-full w-full">Новая статья</button>
      </Link>
      <div className="bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center">
        <AlertMake userId={"all"} />
        <span>Оповещение всем</span>
      </div>
      <div className="bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center">
        <AlertMake userId={"cmeyiq2k2007lz3tec7kac956"} />
        <span>Оповещение мне</span>
      </div>
    </div>
  );
}
