"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import MakeHelper from "../../components/base/helper";
import { Audio } from "../../components/base/audio";
import "react-toastify/dist/ReactToastify.css";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gameID, setGameID] = useState("");
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCheckingPlayer, setIsCheckingPlayer] = useState(false);
  const router = useRouter();

  // Автоматическая проверка игрока при вводе 8 цифр
  useEffect(() => {
    const checkPlayer = async () => {
      if (gameID.length === 8 && !isCheckingPlayer) {
        setIsCheckingPlayer(true);
        try {
          const response = await fetch(`/api/warpath/player/${gameID}`);
          if (!response.ok) {
            toast.error("Игрок не найден");
            setPlayerData([]);
            return;
          }
          const data = await response.json();
          setPlayerData(data);
          toast.success("Игрок найден!");
        } catch (error) {
          toast.error("Ошибка при поиске игрока");
          setPlayerData([]);
        } finally {
          setIsCheckingPlayer(false);
        }
      }
    };

    const timeoutId = setTimeout(checkPlayer, 5000); // Задержка для debounce
    return () => clearTimeout(timeoutId);
  }, [gameID, isCheckingPlayer]);

  const handleFormSubmit = async function (ev: React.FormEvent) {
    ev.preventDefault();
    setLoading(true);

    // Валидация
    if (!email || !password || !gameID) {
      toast.error("Все поля обязательны для заполнения");
      setLoading(false);
      return;
    }

    if (playerData.length === 0) {
      toast.error("Сначала проверьте ваш игровой ID");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          gameID, 
          username: playerData[0].nick, 
          email, 
          password 
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success("Регистрация успешна! Перенаправляем...");
        setTimeout(() => router.push("/singin"), 2000);
      } else {
        toast.error(result.message || "Ошибка регистрации");
      }
    } catch (error) {
      toast.error("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 flex flex-row items-center justify-center">
      <section className="w-1/4 auth backdrop-blur-md border border-gray-400 rounded-6xl p-4">
        <h1 className="text-3xl text-center mb-6">Регистрация</h1>
        
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <label className="flex flex-col">
            <div className="flex justify-between items-center">
              <span>Ваш ID</span>
              <MakeHelper text="Где взять?" imagesrc="/source/help/ID.png" />
            </div>
            <input
              className="max-h-12 w-full p-2 border rounded"
              type="text"
              name="id"
              placeholder="XXXXXXXX"
              value={gameID}
              onChange={(ev) => setGameID(ev.target.value)}
              maxLength={8}
              required
            />
            {isCheckingPlayer && (
              <div className="mt-2 text-sm text-blue-500">Проверяем игрока...</div>
            )}

            <section className={playerData.length > 0 ? "mt-4" : "hidden"}>
              {playerData.map((user) => (
                <div
                  key={user.nick}
                  className="grid grid-cols-6 grid-rows-2 mx-auto px-4 py-2 bg-white rounded-xl shadow-md"
                >
                  <div className="col-span-4">
                    <h1 className="font-semibold">
                      [{user.ally}] {user.nick}
                    </h1>
                  </div>
                  <div className="col-span-2 row-span-2 text-center">
                    <p className="text-sm">{user.power}</p>
                  </div>
                  <div className="col-span-4 inline-flex items-center">
                    <Image
                      src="/source/icon/kills.png"
                      width={20}
                      height={20}
                      alt=""
                    />
                    <span className="ml-1">{user.sumkill}</span>
                    <span className="mx-1">K/D:</span>
                    <span>
                      {isNaN(user.sumkill / user.die)
                        ? "0"
                        : (user.sumkill / user.die).toFixed(2)}
                    </span>
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
              placeholder="example@mail.com"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              className="p-2 border rounded"
            />
          </label>

          <label>
            <span>Пароль</span>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="•••••••••"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              minLength={6}
              className="p-2 border rounded"
            />
          </label>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading || isCheckingPlayer}
          >
            {loading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>

        <Link href="/singin" className="block text-center mt-4 text-blue-500 hover:text-blue-700">
          Войти --&gt;
        </Link>
        
        <Audio src="/audio/polet.mp3" />
      </section>
    </div>
  );
}