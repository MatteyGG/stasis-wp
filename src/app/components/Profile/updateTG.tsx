import { useSession } from "next-auth/react";
import { useState } from "react";

export default function UpdateTGRef({ tgref, id }: { tgref: string, id: string }) {
  const [newTGRef, setNewTGRef] = useState(tgref);
  const { data: session, update } = useSession();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/userUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, tgref: newTGRef }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      await update({
        ...session,
        tgref: newTGRef,
        username: session!.user.username,
        army: session!.user.army,
        nation: session!.user.nation,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="p-4 rounded-lg shadow-md" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-4">Обновить ссылку на Telegram</h1>
      <div className="mb-4">Ваша ссылка на Telegram: {tgref}</div>
      <label className="block mb-2">
        Новая ссылка на Telegram:
        <input
          type="text"
          name="tgref"
          className="px-4 py-2 border rounded-md"
          value={newTGRef}
          onChange={(event) => setNewTGRef(event.currentTarget.value)}
        />
      </label>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Обновить
      </button>
    </form>
  );
}

