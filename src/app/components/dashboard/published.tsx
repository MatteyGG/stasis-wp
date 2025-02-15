"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

interface PublishedProps {
  published: boolean;
  pageid: string;
}

export default function Published({ published, pageid }: PublishedProps) {
  const [isPublished, setIsPublished] = useState(published);

  const handlePublish = async () => {
    const response = await fetch(`/api/markdown/${pageid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ published: !isPublished }),
    });

    if (response.ok) {
      setIsPublished(!isPublished);
      toast.success(`Страница ${isPublished ? "не " : ""}опубликована`);
    } else {
      toast.error("Ошибка во время публикации страницы");
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/markdown/${pageid}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast.success("Страница удалена");
    } else {
      toast.error("Ошибка во время удаления страницы");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-1 md:flex md:flex-row space-x-1 items-baseline">
      <Link
        href={`/edit/?pageid=${pageid}`}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl"
      >
        Редактировать ↑
      </Link>
      <button
        className={`bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-xl ${
          isPublished ? "opacity-50" : ""
        }`}
        onClick={handlePublish}
      >
        {isPublished ? "Скрыть" : "Опубликовать ->"}
      </button>
      <button
        className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl"
        onClick={handleDelete}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <p className="ml-2 md:hidden">Удалить</p>
      </button>
    </div>
  );
}

