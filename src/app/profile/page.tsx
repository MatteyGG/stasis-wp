"use client";

import { redirect } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session.user) {
      setUsername(session.user.username);
      setEmail(session.user.email);
      setPhone(session.user.phone);
      setImage(session.user.image);
      console.log(session);
    }
  }, [session, status]);

  if (status === "unauthenticated") {
    redirect("/login");
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  async function handeleProfileUpdate(e) {
    e.preventDefault();
    console.log("submit");
    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        phone: phone,
      }),
    });
  }

  return (
    <>
      <section className="mx-auto md:w-1/2">
        <HeaderPage text="Профиль" />
        <div className="flex gap-1 mt-6">
          {session.user?.image ? (
            <div>
              <Image
                className="rounded-sm object-cover w-24 h-24"
                src={image}
                alt={username}
                width={64}
                height={64}
              />
              <label>
                <input className="hidden" type="file" />
                <span className="block border border-primary rounded-lg p-2 text-xs text-center">
                  Изменить
                </span>
              </label>
            </div>
          ) : (
            <label>
              <input
                className="hidden"
                type="file"
                onChange={(e) => console.log(e.target.files[0])}
              />
              <span className="block border border-primary rounded-lg p-2 text-xs text-center">
                Загрузить фото
              </span>
            </label>
          )}

          <form className="grow" onSubmit={handeleProfileUpdate}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Иван Иванов"
            />
            <input
              type="email"
              readOnly={true}
              disabled={true}
              value={email}
              placeholder="podgoroy@example.com"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="8 999 999 99 99"
            />
            <button className="submit w-full" type="submit">
              Сохранить
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
