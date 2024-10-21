"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { providerMap } from "../auth";
import { AuthError } from "next-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = async function (event) {
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
    <div className="flex mt-12 items-center justify-center">
      <section className="auth backdrop-blur-3xl  rounded-6xl shadow-xl gap-4">
        <h1 className="text-3xl">Вход</h1>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="email">
            Email
            <input
              name="email"
              id="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              name="password"
              id="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </label>
          <button type="submit" >
            <span>Sign in</span>
          </button>
        </form>
        <p className="text-center">
          <b>или</b>
        </p>
        {Object.values(providerMap).map((provider) => (
          <form
            className="w-full"
            key={provider.id}
            action={async () => {
              try {
                await signIn(provider.id, {
                  redirectTo: props.searchParams?.callbackUrl ?? "",
                });
              } catch (error) {
                if (error instanceof AuthError) {
                  return console.log(error);
                }

                throw error;
              }
            }}
          >
            <button type="submit">
              <span>Sign in with {provider.name}</span>
            </button>
          </form>
        ))}
        <Link href="/registration" className="text-base mt-4">
          Зарегестрироваться --&gt;
        </Link>
      </section>
    </div>
  );
}
