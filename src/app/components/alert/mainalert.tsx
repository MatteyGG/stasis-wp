
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
    <div className="w-full inline-flex items-center">
      <span className="mr-2 text-gray-600">25.01.23: </span>
      <div
        className={`w-full border rounded-b px-4 py-3 space-y-4 ${getStyles()}`}
      >
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Alert;
