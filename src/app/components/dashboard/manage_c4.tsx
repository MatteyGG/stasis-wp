"use client";

import React, { useEffect, useState } from "react";
import { C4Status, C4 } from "@/lib/types";

const maps = {
  cairo: "Каир",
  newyork: "Нью-Йорк",
  moscow: "Москва",
  sea: "Эгейское море",
  vancouver: "Ванкувер",
  berlin: "Берлин",
  paris: "Париж",
  london: "Лондон",
  rome: "Рим",
  chicago: "Чикаго",
  sanfrancisco: "Сан-Франциско",
};

const C4ManagerDashboard: React.FC = () => {
  const [c4, setC4] = useState<C4 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapSelection, setMapSelection] = useState("cairo");
  const [dateOfData, setDateofData] = useState(String);
  useEffect(() => {
    fetchC4();
  }, []);

  async function fetchC4() {
    setIsLoading(true);
    // try {
    //   const res = await fetch("/api/warpath/getDate");
    //   const data = await res.json();
    //   setDateofData(data);
    // } catch (error) {
    //   console.error("Error fetching date:", error);
    // } finally {
    //   setIsLoading(false);
    // }
    try {
      const res = await fetch("/api/c4/current");
      const data: C4 = await res.json();
      setC4(data);
    } catch (error) {
      console.error("Error fetching C4 status:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function startC4() {
    setIsLoading(true);
    try {
      await fetch("/api/c4/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ map: mapSelection }),
      });
      await fetchC4();
    } catch (error) {
      console.error("Error starting C4:", error);
      setIsLoading(false);
    }
  }

  async function finishC4() {
    setIsLoading(true);
    try {
      await fetch("/api/c4/finish", { method: "POST" });
      await fetchC4();
    } catch (error) {
      console.error("Error finishing C4:", error);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Загрузка состояния C4...</div>;
  }

  return (
    <div className="flex flex-col px-5 w-full gap-6 max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Управление C4</h1>
      

      {!c4 || c4.status === C4Status.None ? (
        <C4StartForm
          mapSelection={mapSelection}
          setMapSelection={setMapSelection}
          startC4={startC4}
        />
      ) : null}

      {c4?.status === C4Status.Active && (
        <C4Active c4={c4} finishC4={finishC4} />
      )}

      {c4?.status === C4Status.Finished && <C4Finished c4={c4} />}
    </div>
  );
};

interface C4StartFormProps {
  mapSelection: string;
  setMapSelection: React.Dispatch<React.SetStateAction<string>>;
  startC4: () => Promise<void>;
  dateOfData?: String;
}

const C4StartForm: React.FC<C4StartFormProps> = ({
  mapSelection,
  setMapSelection,
  startC4,
  dateOfData,
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">C4 не активно</h2>
    <p>
      Последнее обновление данных:  {dateOfData}
    </p>

    <div className="mb-4">
      <label className="block mb-2 font-medium">Выберите карту:</label>
      <select
        value={mapSelection}
        onChange={(e) => setMapSelection(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {Object.entries(maps).map(([key, name]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>
    </div>

    <button
      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition"
      onClick={startC4}
    >
      Начать новое завоевание
    </button>
  </div>
);

interface C4ActiveProps {
  c4: C4;
  finishC4: () => Promise<void>;
}

const C4Active: React.FC<C4ActiveProps> = ({ c4, finishC4 }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">
    Активное завоевание: {maps[c4.map as keyof typeof maps] || c4.map}
      </h2>
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
        Активно
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <p className="text-gray-600">Начато:</p>
        <p className="font-medium">{new Date(c4.startedAt).toLocaleString()}</p>
      </div>
      <div>
        <p className="text-gray-600">Длительность:</p>
        <p className="font-medium">
          {Math.floor(
            (Date.now() - new Date(c4.startedAt).getTime()) / 3600000
          )} часов
        </p>
      </div>
    </div>

    <button
      className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md transition"
      onClick={finishC4}
    >
      Завершить завоевание
    </button>
  </div>
);

interface C4FinishedProps {
  c4: C4;
}

const C4Finished: React.FC<C4FinishedProps> = ({ c4 }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">
        Завершённое завоевание: {maps[c4.map as keyof typeof maps] || c4.map}
      </h2>
      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
        Завершено
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-gray-600">Начато:</p>
        <p className="font-medium">{new Date(c4.startedAt).toLocaleString()}</p>
      </div>
      <div>
        <p className="text-gray-600">Завершено:</p>
        <p className="font-medium">
          {c4.endedAt ? new Date(c4.endedAt).toLocaleString() : "N/A"}
        </p>
      </div>
    </div>

    <div className="mt-6">
      <h3 className="font-medium mb-2">Статистика:</h3>
      <ul className="space-y-2">
        <li>• Снапшотов игроков: {c4.stats?.length || 0}</li>
      </ul>
    </div>
  </div>
);

export default C4ManagerDashboard;
