"use client";

import React, { useEffect, useState } from "react";
import C4Card from "../c4/c4Card";
import Link from "next/link";

const maps = { "cairo": "Каир", "newyork": "Нью-Йорк", "moscow": "Москва", "sea": "Эгейское море", "vancouver": "Ванкувер", "berlin": "Берлин", "paris": "Париж", "london": "Лондон", "rome": "Рим", "chicago": "Чикаго", "sanfrancisco": "Сан-Франциско" };

const C4ManagerDashboard: React.FC = () => {
    const [currentC4, setCurrentC4] = useState({ status: "", players: "", map: "", link: "" });
    const [teststate, settestState] = useState({mode: 0});
    const [date, setDate] = useState(() => {
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
        return formattedDate;
    });
    const [players, setPlayers] = useState(0);
    const [map, setMap] = useState("");

    useEffect(() => {
        fetch("/api/c4")
            .then((res) => res.json())
            .then((data) => setCurrentC4(data.c4));
    }, []);


    return (
        <>
            <div className="flex flex-col px-5 w-full gap-3 justify-center">
                <button 
                    className="bg-blue-300 hover:bg-gray-300 rounded-md py-3" 
                    onClick={() => settestState({ mode: 1 })}>
                    Открыть регистрацию
                </button>
                <button 
                    className="bg-blue-300 hover:bg-gray-300 rounded-md py-3" 
                    onClick={() => settestState({ mode: 2 })}>
                    Начать завоевание
                </button>
                <button 
                    className="bg-blue-300 hover:bg-gray-300 rounded-md py-3" 
                    onClick={() => settestState({ mode: 3 })}>
                    Подвести итоги
                </button>

                <p>Mode: {teststate.mode}</p>
            </div>
            <div className="px-5 w-full  flex flex-col gap-3 justify-center">
            {teststate.mode === 1 && (
                <div className="bg-white rounded-md p-5">
                    <h2 className="text-2xl">Открыть регистрацию</h2>
                    <button 
                        className="bg-blue-400 hover:bg-blue-500 text-white rounded-md py-2 px-4 mt-3"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to open registration?")) {
                                window.location.href = "/players";
                            }
                        }}
                    >
                        Открыть регистрацию
                    </button>
                    <p>
                            <a className="text-blue-500 underline" href="/players">Перейти</a> к выбору игроков
                    </p>
                </div>
            )}
            {teststate.mode === 2 && (
                <div className="bg-white rounded-md p-5 space-y-4">
                    <h2 className="text-2xl mb-4">Начать завоевание</h2>
                    <div className="relative">
                        <label className="block text-gray-700 mb-2">Выберите карту</label>
                        <select 
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 appearance-none bg-white px-4 py-2 pr-8 rounded-md z-10" 
                            onChange={(e) => setMap(e.target.value)}
                        >
                            <option value="" className="text-gray-400">Выберите карту</option>
                            {Object.keys(maps).map((key) => (
                                <option key={key} value={key} className="text-gray-700">{maps[key]}</option>
                            ))}
                        </select>
                        <svg className="absolute inset-y-0 right-0 mr-2 w-5 h-5 text-gray-700" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                            <path d="M7 7l3-3 3 3M3 3h18v3H3z" />
                        </svg>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Дата начала</label>
                        <input 
                            type="text" 
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                            value={date.toString().slice(0, 10)} 
                            onChange={(e) => setDate(new Date(e.target.value.replace(/\./g, '-')))} 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Общее количество игроков</label>
                        <input 
                            type="number" 
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                            value={players} 
                            onChange={(e) => setPlayers(parseInt(e.target.value))} 
                        />
                        <p className="text-sm text-gray-500 mt-1">Ведется сбор статистики игроков: 65/{players}</p>
                    </div>
                </div>
            )}
            {teststate.mode === 3 && (
                <div className="bg-white rounded-md p-5 space-y-4">
                    <h2 className="text-2xl">Закрыть C4</h2>
                    <div className="flex justify-center items-center space-x-3">
                        <label className="text-gray-700 mb-2">
                            <input type="radio" name="result" value="win" className="hidden" />
                            <span className="flex items-center p-3 rounded-lg border border-gray-300 shadow-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50">
                                <span>Победа</span>
                            </span>
                        </label>
                        <label className="text-gray-700 mb-2">
                            <input type="radio" name="result" value="lose" className="hidden" />
                            <span className="flex items-center p-3 rounded-lg border border-gray-300 shadow-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50">
                                <span>Поражение</span>
                            </span>
                        </label>
                    </div>
                    <button 
                        className="bg-white rounded-md py-2 px-4 mt-3 shadow-md"
                    >
                        Подвести итоги
                    </button>
                </div>
            )}
            </div>
        </>

    );
};

export default C4ManagerDashboard;

