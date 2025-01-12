"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = async function (event: React.FormEvent) {
    event.preventDefault();
    console.log({ email, password });
    const signInData = await signIn("credentials", {
      email,
      password,
      redirect:false
    });

    if (signInData?.error) {
      console.error(signInData);
    } else {
      router.push("/");
      router.refresh();
    }
  };
  return (
    <div className="mt-12 flex flex-row items-center justify-center ">
      <section className="w-3/4 auth backdrop-blur-3xl  rounded-6xl shadow-xl gap-4">
        <h1 className="text-3xl">Вход</h1>
        <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
          <label htmlFor="email">
            Почта
            <input
              name="email"
              id="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </label>
          <label htmlFor="password">
            Пароль
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
            <span>Войти</span>
          </button>
        </form>
        <Link href="/registration" className="text-base mt-4">
          Зарегестрироваться --&gt;
        </Link>
      </section>
    </div>
  );
}
