
"use client"
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const notifyCopy = (message: string) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

  const isRecent = (date: Date) => {
    const now = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(now.getDate() - 3);

    // Check if the date is within the last 3 days
    return date >= threeDaysAgo && date <= now;
  };


export default function PromocodeItem({ promocode }: { promocode: { code: string; createdAt: string } }) {

  return (
    <li
      className={`inline-flex text-black text-sm p-1 rounded-lg ${
        isRecent(new Date(promocode.createdAt))
          ? "bg-green-200"
          : "bg-gray-300"
      }`}
    >
      <button
        onClick={() => {
          navigator.clipboard.writeText(promocode.code);
          notifyCopy("Промокод скопирован");
        }}
      >
        <Image src="/source/icon/copy.png" width={24} height={24} alt="" />
      </button>
      <b className="ml-2 text-center mt-1">{promocode.code}</b>
    </li>
  );
};
