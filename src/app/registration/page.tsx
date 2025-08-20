"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Select from "react-select";
import MakeHelper from "../../components/base/helper";
import { Audio } from "../../components/base/audio";

interface Player {
  username: string;
  power: string;
  ally: string;
  kills: string;
  death: string;
  nick: string;
  sumkill: number;
  die: number;
}

export default function RegistrationPage() {
  const nation_array = ["Vanguard", "Liberty", "Martyrs"];
  const army_array = [
    "Icon-infantry",
    "Icon-LTank",
    "Icon-MTank",
    "Icon-tank-hunter",
    "Icon-HTank",
    "Icon-SH",
    "Icon-launcher",
    "Icon-howitzer",
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [gameID, setGameID] = useState("");
  const [army, setArmy] = useState("");
  const [nation, setNation] = useState("");
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const IdChanged = async function (ev: React.FormEvent) {
    ev.preventDefault();

    if (gameID) {
      const response = await fetch(`/api/warpath/player/${gameID}`);
      const data = await response.json();
      console.log(data);
      if (data.length === 0) {
        return setChecked(false);
      }
      setPlayerData(data);
      setUsername(data[0].nick);
      setChecked(true);
    }
  };

  const handleFormSubmit = async function (ev: React.FormEvent) {
    ev.preventDefault();
    console.log({ email, password });

    const response = await fetch("/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID, username, email, password, army, nation }),
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
          <label className="flex flex-col">
            <div className="flex justify-between items-center">
              <span>Ваш ID</span>
              <MakeHelper text="Где взять?" imagesrc="/source/help/ID.png" />
            </div>
            <input
              className="max-h-12 w-5/6"
              type="text"
              name="id"
              placeholder="XXXXXXXX"
              value={gameID}
              onChange={(ev) => setGameID(ev.target.value)}
              onBlur={IdChanged}
            />

            <section
              className={
                playerData.length > 0
                  ? "mt-2 opacity-100 ease-in-out duration-500 rounded-lg"
                  : " opacity-0"
              }
            >
              {playerData.length > 0 &&
                playerData.map((user) => (
                  <div
                    key={user.nick}
                    className="grid grid-cols-6 grid-rows-2 mx-auto px-4 py-1 ease-in-out duration-300 hover:scale-[1.05] transition-all bg-white rounded-xl shadow-md md:max-w-2xl"
                  >
                    <div className="col-span-3 text-nowrap">
                      <h1>
                        [{user.ally}] {user.nick}
                      </h1>
                    </div>
                    <div className="col-span-2 row-span-2 text-center ">
                      <p className="text-nowrap">{user.power}</p>
                    </div>
                    <div className="w-full col-span-3 inline-flex items-center">
                      <Image
                        className="object-contain"
                        src="/source/icon/kills.png"
                        width={20}
                        height={20}
                        alt=""
                      />
                      <h1>{user.sumkill}</h1>&nbsp;K/D:&nbsp;
                      <h1>
                        {isNaN(user.sumkill / user.die)
                          ? "0"
                          : (user.sumkill / user.die).toFixed(2)}
                      </h1>
                    </div>
                  </div>
                ))}
            </section>
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
          {checked && (
            <button type="submit" className="w-full">
              Зарегистрироваться
            </button>
          )}
        </form>
        <Link href="/singin" className="text-base mt-4">
          Войти --&gt;
        </Link>
        <Audio src="/audio/polet.mp3" />
      </section>
    </div>
  );
}
