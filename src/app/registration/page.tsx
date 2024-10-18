"use client";
import Link from "next/link";
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();
  const handleFormSubmit = async function (event) {
    event.preventDefault();
    console.log({ email, password });

    const response = await fetch("/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username, email, password }),
    });
    if (response.ok) {
      router.push("/login");
    } else {
      console.error("Registration failed");
    }
  }
  return (
    <div className="flex mt-12 items-center justify-center">
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
