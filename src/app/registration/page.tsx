"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

export default function RegistrationPage() {
  const nation_array = ["Vanguard", "Liberty", "Martyrs"];
  const army_array = [
    "Icon-infantry",
    "Icon-LTank",
    "Icon-MTank",
    "Icon-launcher",
    "Icon-HTank",
    "Icon-SH",
    "Icon-howitzer",
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [army, setArmy] = useState("");
  const [nation, setNation] = useState("");

  const router = useRouter();
  const handleFormSubmit = async function (ev: React.FormEvent) {
    ev.preventDefault();
    console.log({ email, password });

    const response = await fetch("/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, army, nation }),
    });
    if (response.ok) {
      router.push("/singin");
    } else {
      console.error("Registration failed");
    }
  };
  return (
    <div className="flex mt-12 items-center justify-center ">
      <section className="auth backdrop-blur-sm rounded-6xl shadow-xl">
        <h1 className="text-3xl">Регистрация</h1>
        <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
          <label>
            <span>Почта</span>
            <input
              type="name"
              name="name"
              placeholder="Иван"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
            />
          </label>
          <label>
            <span>Почта</span>
            <input
              type="email"
              name="email"
              placeholder="podgoroy@example.com"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </label>
          <label>
            <span>Пароль</span>
            <input
              type="password"
              name="password"
              autoComplete="password"
              placeholder="•••••••••"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </label>
          <div>
            <div className="flex justify-center items-center">
              {Object.values(nation_array).map((nation, index) => (
                <label
                  key={index}
                  className="relative flex items-center cursor-pointer hover:ease-in-out hover:scale-110 duration-200"
                  htmlFor={nation}
                >
                  <input
                    name="framework-custom-icon"
                    type="radio"
                    className="peer/nation opacity-20"
                    id={nation}
                    onClick={() => setNation(nation)}
                  />
                  <Image
                    className="peer-checked/nation:ring-2 peer-checked/nation:ring-blue peer-checked:rounded-lg"
                    src={"/" + nation + ".webp"}
                    alt={nation}
                    height={70}
                    width={70}
                  />
                </label>
              ))}
            </div>
            <div className="inline-flex items-center">
              {Object.values(army_array).map((army, index) => (
                <label
                  key={index}
                  className="relative flex items-center cursor-pointer hover:ease-in-out hover:scale-110 duration-200"
                  htmlFor={army}
                >
                  <input
                    name="framework-custom-icon"
                    type="radio"
                    className="peer/army opacity-20"
                    id={army}
                    onClick={() => setArmy(army)}
                  />
                  <Image
                    className="peer-checked/army:ring-2 peer-checked/army:ring-blue peer-checked:rounded-lg"
                    src={"/" + army + ".webp"}
                    alt={army}
                    height={32}
                    width={32}
                  />
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full">
            Зарегестрироваться
          </button>
          <p className="text-center">
            <b>или</b>
          </p>
          <div className="flex flex-col justify-center gap-1">
            <button className="w-full ">Войти с ЯндексID</button>
            <button className="w-full ">Войти с ВК</button>
          </div>
        </form>
        <Link href="/login" className="text-base mt-4">
          Войти --&gt;
        </Link>
      </section>
    </div>
  );
}
