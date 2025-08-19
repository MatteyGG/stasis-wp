"use client";

import React, { useEffect, useState } from "react";
import { C4Status, C4, PlayerSnapshot } from "@/lib/types";
import { lastDate } from "@/lib/getDate";

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
  const [dateOfData, setDateofData] = useState<string>("");
  const [bindStatus, setBindStatus] = useState<string | null>(null);
  const [unboundSnapshots, setUnboundSnapshots] = useState<PlayerSnapshot[]>([]);

useEffect(() => {
  const init = async () => {
    await fetchC4();
    setDateofData(await lastDate());
    fetchUnboundSnapshots();
  };
  init();
}, []);

  async function fetchUnboundSnapshots() {
    try {
      const res = await fetch("/api/snapshots/unbound");
      if (!res.ok) throw new Error("Failed to fetch unbound snapshots");
      const data = await res.json();
      setUnboundSnapshots(data);
    } catch (error) {
      console.error("Error fetching unbound snapshots:", error);
    }
  }

  async function fetchC4() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/c4/current");
      if (!res.ok) throw new Error("Failed to fetch C4 status");
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
      const res = await fetch("/api/c4/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ map: mapSelection }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to start C4");
      }
      
      const data = await res.json();
      setC4({ ...data, status: "active" });
      await fetchUnboundSnapshots();
    } catch (error) {
      console.error("Error starting C4:", error);
      setBindStatus(`Ошибка запуска: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function finishC4() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/c4/finish", { 
        method: "POST" 
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to finish C4");
      }
      
      await fetchC4();
      await fetchUnboundSnapshots();
    } catch (error) {
      console.error("Error finishing C4:", error);
      setBindStatus(`Ошибка завершения: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function bindPlayers() {
    setIsLoading(true);
    setBindStatus("Начата привязка снапшотов...");
    
    try {
      const res = await fetch("/api/snapshots/bind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ c4Id: c4?.id })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to bind players");
      }
      
      const result = await res.json();
      setBindStatus(`Успешно привязано: ${result.updatedCount} снапшотов`);
      await fetchUnboundSnapshots();
    } catch (error) {
      console.error("Bind players error:", error);
      setBindStatus(`Ошибка: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setBindStatus(null), 5000);
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Загрузка состояния C4...</div>;
  }

  return (
    <div className="flex flex-col px-5 w-full gap-6 max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Управление C4</h1>
      
      {/* Статус привязки */}
      {bindStatus && (
        <div className={`p-3 rounded-md text-center ${
          bindStatus.includes("Успешно") 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {bindStatus}
        </div>
      )}
      
      {/* Непривязанные снапшоты */}
      {unboundSnapshots.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <h3 className="font-medium mb-2 text-yellow-800">
            Непривязанные снапшоты: {unboundSnapshots.length}
          </h3>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
            onClick={bindPlayers}
            disabled={isLoading}
          >
            {isLoading ? "Обработка..." : "Привязать все"}
          </button>
        </div>
      )}

      {!c4 || c4.status === C4Status.None ? (
        <C4StartForm
          mapSelection={mapSelection}
          setMapSelection={setMapSelection}
          startC4={startC4}
          dateOfData={dateOfData}
        />
      ) : null}

      {c4?.status === "active" && (
        <C4Active 
          c4={c4} 
          finishC4={finishC4} 
          bindPlayers={bindPlayers}
          isLoading={isLoading}
        />
      )}

      {c4?.status === C4Status.Finished && (
        <>
          <C4Finished c4={c4} />
          <C4StartForm
            mapSelection={mapSelection}
            setMapSelection={setMapSelection}
            startC4={startC4}
            dateOfData={dateOfData}
          />
        </>
      )}
    </div>
  );
};

interface C4StartFormProps {
  mapSelection: string;
  setMapSelection: React.Dispatch<React.SetStateAction<string>>;
  startC4: () => Promise<void>;
  dateOfData?: string;
}

const C4StartForm: React.FC<C4StartFormProps> = ({
  mapSelection,
  setMapSelection,
  startC4,
  dateOfData,
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">C4 не активно</h2>
    <p className="text-gray-600 mb-4">
      Последнее обновление данных: {dateOfData && dateOfData.length === 8 ? `${dateOfData.slice(6, 8)}.${dateOfData.slice(4, 6)}.${dateOfData.slice(0, 4)}` : "Нет ответа от сервера"}
    </p>

    <div className="mb-4">
      <label className="block mb-2 font-medium">Выберите карту:</label>
      <select
        value={mapSelection}
        onChange={(e) => setMapSelection(e.target.value)}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
      >
        {Object.entries(maps).map(([key, name]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>
    </div>

    <button
      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition font-medium"
      onClick={startC4}
    >
      Начать новое завоевание
    </button>
  </div>
);

interface C4ActiveProps {
  c4: C4;
  finishC4: () => Promise<void>;
  bindPlayers: () => Promise<void>;
  isLoading: boolean;
}

const C4Active: React.FC<C4ActiveProps> = ({ 
  c4, 
  finishC4, 
  bindPlayers,
  isLoading 
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">
        Активное завоевание: {maps[c4.map as keyof typeof maps] || c4.map}
      </h2>
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
        Активно
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <p className="text-gray-600">Начато:</p>
        <p className="font-medium">
          {new Date(c4.startedAt).toLocaleString('ru-RU')}
        </p>
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

    <div className="grid grid-cols-2 gap-3">
      <button
        className={`bg-gray-500 hover:bg-gray-600 text-white py-2 rounded transition ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        onClick={bindPlayers}
        disabled={isLoading}
      >
        {isLoading ? 'Привязка...' : 'Привязать игроков'}
      </button>
      
      <button
        className={`bg-red-500 hover:bg-red-600 text-white py-2 rounded transition ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        onClick={finishC4}
        disabled={isLoading}
      >
        {isLoading ? 'Завершение...' : 'Завершить завоевание'}
      </button>
    </div>
  </div>
);

interface C4FinishedProps {
  c4: C4;
}

const C4Finished: React.FC<C4FinishedProps> = ({ c4 }) => {
  const durationHours = c4.endedAt 
    ? ((new Date(c4.endedAt).getTime() - new Date(c4.startedAt).getTime()) / 3600000)
    : 0;
    
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Завершённое завоевание: {maps[c4.map as keyof typeof maps] || c4.map}
        </h2>
        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
          Завершено
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-600">Начато:</p>
          <p className="font-medium">
            {new Date(c4.startedAt).toLocaleString('ru-RU')}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Завершено:</p>
          <p className="font-medium">
            {c4.endedAt ? new Date(c4.endedAt).toLocaleString('ru-RU') : "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-2">Статистика:</h3>
        <ul className="space-y-2">
          <li>• Участников: {c4.totalPlayers || 0}</li>
          <li>• Продолжительность: {durationHours.toFixed(1)} часов</li>
          {c4.avgPowerGain && <li>• Средний прирост силы: {c4.avgPowerGain.toLocaleString()}</li>}
          {c4.avgKillGain && <li>• Средний прирост убийств: {c4.avgKillGain.toLocaleString()}</li>}
        </ul>
      </div>
    </div>
  );
};

export default C4ManagerDashboard;