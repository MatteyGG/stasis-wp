import { useState } from "react";

export default function UpdateNickname({ nickname }: { nickname: string }) {
  const [newNickname, setNewNickname] = useState(nickname);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/userUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname: newNickname }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="p-4 rounded-lg shadow-md" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-4">Обновить ник</h1>
      <div className="mb-4">{nickname}</div>
      <label className="block mb-2">
        Новый ник:
        <input
          type="text"
          name="nickname"
          className="px-4 py-2 border rounded-md"
          value={newNickname}
          onChange={(event) => setNewNickname(event.currentTarget.value)}
        />
      </label>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Обновить
      </button>
    </form>
  );
}

