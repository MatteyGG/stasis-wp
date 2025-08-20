import Alert from "../alert/mainalert";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HistoryAlerts({ alerts_array }: { alerts_array: { type: string; message: string }[] }) {
  return (
    <div className="flex w-full justify-center items-center">
      <div className="p-6 rounded-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Уведомления</h2>
        <ul className="w-full gap-2 flex flex-col">
          {alerts_array.map((alert, index) => {
            const alertType = alert.type.toLowerCase();
            if (["info", "warning", "error", "success"].includes(alertType)) {
              return (
                <Alert
                  key={index}
                  type={alertType as "info" | "warning" | "error" | "success"}
                  message={alert.message}
                />
              );
            } else {
              console.error(`Invalid alert type: ${alertType}`);
              return null;
            }
          })}
        </ul>
      </div>
    </div>
  );
}

