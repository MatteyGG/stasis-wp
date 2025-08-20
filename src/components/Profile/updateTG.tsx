import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const notify = (message: string) =>
  toast.success(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

const notifyError = (message: string) =>
  toast.error(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

export default function UpdateTGRef({
  tgref,
  id,
}: {
  tgref: string;
  id: string;
}) {
  const [newTGRef, setNewTGRef] = useState(tgref);
  const { data: session, update } = useSession();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (tgref === newTGRef.slice(1) || newTGRef === "" || newTGRef === " ") {
      notifyError("Пожалуйста, введите новую ссылку на Telegram");
      return;
    }
    if (newTGRef.length > 32) {
      notifyError("Слишком длинная ссылка на Telegram");
      return;
    }
    if (!newTGRef.startsWith("@")) {
      notifyError("Ссылка на Telegram должна начинаться с @");
      return;
    }

    try {
      const response = await fetch("/api/userUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, tgref: newTGRef.slice(1) }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      notify("Новый Telegram-ник: @" + newTGRef.slice(1));
      if (session?.user) {
        await update({
          ...session,
          tgref: newTGRef.slice(1),
          username: session.user.username,
          army: session.user.army,
          nation: session.user.nation,
        });
      }
    } catch (error) {
      notifyError("Ошибка: " + error);
    }
  };

  return (
    <>
      <form className="p-4 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Обновить ссылку на Telegram</h1>
        <div className="mb-4">Ваше имя пользователя в Telegram: @{tgref}</div>
        <label className="block mb-2">
          Новое имя пользователя в Telegram:
          <input
            type="text"
            name="tgref"
            className="px-4 py-2 border rounded-md"
            placeholder={"@stasis-wp"}
            onChange={(event) => setNewTGRef(event.currentTarget.value)}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Обновить
        </button>
      </form>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
