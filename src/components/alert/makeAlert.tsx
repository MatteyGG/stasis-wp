'use client'

import Image from "next/image";
import React, { useState } from 'react';

export default function AlertMake({ userId }: { userId: string }){
    const [isVisible, setIsVisible] = useState(false);
    const [type, setType] = useState("warning");
    const [message, setMessage] = useState("");
    const handleClick = () => {
      setIsVisible(!isVisible);
    };

    const handleFormSubmit = async function(ev: React.FormEvent) {
      ev.preventDefault();
      console.log(userId, type, message);
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userId, type, message }),
      });
    
      if (response.ok) {
        setIsVisible(false);
        console.log("Form submitted successfully");
      } else {
        console.error("Form submission failed", response);
        // Display an error message to the user
        setMessage("Error: Form submission failed. Please try again.");
      }
    };

    return (
      <div className=" flex-col md:flex-row md:inline-flex text-base ">
        {isVisible && (
          <form
            onSubmit={handleFormSubmit}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-all duration-300"
          >
            <div className="bg-white p-4 rounded-md shadow-lg w-1/3 relative">
            <h1>Новое сообщение для {userId}</h1>
              <button
                className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800"
                onClick={handleClick}
              >
                <Image
                  src="/source/false.svg"
                  width={24}
                  height={24}
                  alt="close"
                />
              </button>
              <select
                className={`${type}`}
                value={type}
                onChange={(ev) => setType(ev.target.value)}
              >
                <option className="warning" value="warning">
                  Предупреждение
                </option>
                <option className="info" value="info">
                  Информация
                </option>
                <option className="error" value="error">
                  Важно
                </option>
                <option className="success" value="success">
                  Поощрение
                </option>
              </select>
              <textarea
                value={message}
                onChange={(ev) => setMessage(ev.target.value)}
                className="w-full border-gray-600 border rounded-md mb-2"
              />
              <button className="p-4 w-full bg-blue-500 text-white rounded-md">
                Отправить
              </button>
            </div>
          </form>
        )}
        <button onClick={handleClick}>
          <Image
            src="/source/icon/alert_ico.png"
            width={36}
            height={36}
            alt="Новая заметка"
          />
        </button>
      </div>
    );
}

