import Image from "next/image";
import { FC } from "react";

interface AlertProps {
  type: "info" | "warning" | "error" | "success";
  message: string;
}

const Alert: FC<AlertProps> = ({ type, message }) => {
  const getStyles = () => {
    switch (type) {
      case "warning":
        return "warning";
      case "error":
        return "error";
      case "success":
        return "success";
      case "info":
        return "info";
    }
  };

  return (
    <div
      className={`inline-flex w-full rounded-3xl bg-slate-300  bg-opacity-85 place-items-center px-4 py-3 gap-4 ${getStyles()}`}
    >
      <Image
        className=" object-scale-down "
        src={`/source/icon/${getStyles()}.png`}
        width={32}
        height={32}
        alt=""
      />
      <div className="w-full  inline-flex justify-between">
        <p className="mt-3 items-baseline text-black">{message}</p>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">23 ноября 2024</span>
          <p className="text-center text-emerald-600">+1</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
