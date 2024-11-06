"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Select from "react-select";

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
    <div className="mt-12 flex flex-row items-center justify-center ">
      <section className="w-1/4 auth backdrop-blur-md border border-gray-400 rounded-6xl">
        <h1 className="text-3xl">Регистрация</h1>
        <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
          <label>
            <span>Имя</span>
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
          <div className="w-full">
            <Select
              instanceId="nation_select"
              id="nation_select"
              className="peer/nation"
              options={nation_array.map((nation) => ({
                value: nation,
                label: (
                  <div className="flex items-center">
                    <Image
                      className="peer-checked/nation:ring-2 peer-checked/nation:ring-blue peer-checked:rounded-lg"
                      src={"/source/nation/" + nation + ".webp"}
                      alt={nation}
                      height={70}
                      width={70}
                    />
                    <span className="ml-2">{nation}</span>
                  </div>
                ),
              }))}
              onChange={(selectedOption) =>
                setNation(selectedOption?.value ?? "Не выбрано")
              }
            />
            <Select
              instanceId="army_select"
              id="army_select"
              className="peer/nation"
              options={army_array.map((army) => ({
                value: army,
                label: (
                  <div className="flex items-center">
                    <Image
                      className="peer-checked/nation:ring-2 peer-checked/nation:ring-blue peer-checked:rounded-lg"
                      src={"/source/army/" + army + ".webp"}
                      alt={army}
                      height={70}
                      width={70}
                    />
                    <span className="ml-2">{army}</span>
                  </div>
                ),
              }))}
              onChange={(selectedOption) =>
                setArmy(selectedOption?.value ?? "Не выбрано")
              }
            />
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
      <Image
        className="hidden md:block w-3/4 brightness-80 "
        src="/source/stasis_prew.png"
        width={1000}
        height={1000}
        alt=""
      />
    </div>
  );
}
