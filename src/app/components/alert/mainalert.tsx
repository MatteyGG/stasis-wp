
import { FC } from "react";

interface AlertProps {
  type: "info" | "warning" | "error" | "success";
  message: string;
}

const Alert: FC<AlertProps> = ({ type, message }) => {
  const getStyles = () => {
    switch (type) {
      case "warning":
        return "border-t-yellow-600 border-yellow-400 bg-yellow-100 text-yellow-700";
      case "error":
        return "border-t-red-600 border-red-400 bg-red-100 text-red-700";
      case "success":
        return "border-t-green-600 border-green-400 bg-green-100 text-green-700";
      case "info":
        return "border-t-blue-600 border-blue-400 bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className={`w-full border border-t-8 rounded-b px-4 py-3 ${getStyles()}`}>
      <p>{message}</p>
    </div>
  );
};

export default Alert;
