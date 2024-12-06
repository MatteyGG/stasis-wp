import Alert from "../alert/mainalert";

export default function HistoryAlerts( { alerts_array } : { alerts_array: Array<any> } ) {
  return (
    <>
      <div
        className="flex w-full justify-center items-center"
      >
        <div
          className="p-6 rounded-lg w-full"
        >
          <h2 className="text-xl font-semibold mb-4">Уведомления</h2>
          <ul className="w-full gap-2 flex flex-col">
            {alerts_array &&
              Object.values(alerts_array).map((alert, index) => {
                const alertType = alert.type.toString().toLowerCase();
                if (
                  alertType === "info" ||
                  alertType === "warning" ||
                  alertType === "error" ||
                  alertType === "success"
                ) {
                  return (
                    <Alert
                      key={index}
                      type={
                        alertType as "info" | "warning" | "error" | "success"
                      }
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
    </>
  );
}
