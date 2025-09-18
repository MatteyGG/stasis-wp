"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import MakeHelper from "../../components/base/helper";
import { Audio } from "../../components/base/audio";
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";



// Функция проверки сложности пароля (та же, что и на странице смены пароля)
const checkPasswordStrength = (password: string) => {
  const requirements = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const strength = Object.values(requirements).filter(Boolean).length;
  return { requirements, strength };
};

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gameID, setGameID] = useState("");
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCheckingPlayer, setIsCheckingPlayer] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Проверка сложности пароля
  const [passwordStrength, setPasswordStrength] = useState({
    requirements: {
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
    strength: 0,
  });

  // Обновляем проверку сложности пароля при изменении
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  // Проверка, совпадают ли пароли
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  // Автоматическая проверка игрока с debounce
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (gameID.length === 8 && !isCheckingPlayer) {
      const timer = setTimeout(async () => {
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
      }, 1000); // Задержка 1 секунда для debounce

      setDebounceTimer(timer);
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [gameID]);

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

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Пожалуйста, введите корректный email");
      setLoading(false);
      return;
    }

    // Проверка сложности пароля
    if (passwordStrength.strength < 3) {
      toast.error("Пароль слишком слабый. Увеличьте сложность пароля.");
      setLoading(false);
      return;
    }

    // Проверка совпадения паролей
    if (!passwordsMatch) {
      toast.error("Пароли не совпадают");
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
      toast.error("Ошибка сети. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Фоновое видео */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://oss-resource.farlightgames.com/p/SDK/200000/0/100000/2023-03-21/cb9b4854a5ba84837fe4c82c46a58c4e.mp4"
          type="video/mp4"
        />
        Ваш браузер не поддерживает видео.
      </video>
      
      {/* Затемнение фона */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>
      
      {/* Контент */}
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-10 rounded-xl shadow-lg relative z-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Регистрация</h1>
          <p className="mt-2 text-gray-600">
            Создайте учетную запись для доступа к системе
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="gameID"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ваш ID
                </label>
                <MakeHelper text="Где взять?" imagesrc="/source/help/ID.png" />
              </div>
              <input
                id="gameID"
                name="gameID"
                type="text"
                required
                value={gameID}
                onChange={(ev) => setGameID(ev.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="XXXXXXXX"
                maxLength={8}
                pattern="[0-9]{8}"
                title="ID должен состоять из 8 цифр"
              />
              {isCheckingPlayer && (
                <div className="mt-2 text-sm text-blue-500">Проверяем игрока...</div>
              )}
            </div>

            {playerData.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                {playerData.map((user) => (
                  <div
                    key={user.nick}
                    className="grid grid-cols-6 grid-rows-2 px-4 py-2 bg-white rounded-lg shadow-sm"
                  >
                    <div className="col-span-4">
                      <h1 className="font-semibold text-sm">
                        [{user.ally}] {user.nick}
                      </h1>
                    </div>
                    <div className="col-span-2 row-span-2 text-center flex flex-col justify-center">
                      <p className="text-xs font-medium">{user.power}</p>
                    </div>
                    <div className="col-span-4 inline-flex items-center text-xs">
                      <Image
                        src="/source/icon/kills.png"
                        width={16}
                        height={16}
                        alt="Убийства"
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
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Почта
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="example@mail.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Пароль
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 pr-10"
                  placeholder="•••••••••"
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Индикатор сложности пароля */}
              {password.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="text-sm font-medium">Сложность пароля:</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        passwordStrength.strength < 2 ? 'bg-red-500' :
                        passwordStrength.strength < 4 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className={`flex items-center ${passwordStrength.requirements.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasMinLength ? <CheckCircle className="mr-1 h-4 w-4" /> : <AlertCircle className="mr-1 h-4 w-4" />}
                      Не менее 8 символов
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasUpperCase ? <CheckCircle className="mr-1 h-4 w-4" /> : <AlertCircle className="mr-1 h-4 w-4" />}
                      Заглавные буквы (A-Z)
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasLowerCase ? <CheckCircle className="mr-1 h-4 w-4" /> : <AlertCircle className="mr-1 h-4 w-4" />}
                      Строчные буквы (a-z)
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasNumber ? <CheckCircle className="mr-1 h-4 w-4" /> : <AlertCircle className="mr-1 h-4 w-4" />}
                      Цифры (0-9)
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasSpecialChar ? <CheckCircle className="mr-1 h-4 w-4" /> : <AlertCircle className="mr-1 h-4 w-4" />}
                      Спецсимволы (!@#$% и т.д.)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Подтвердите пароль
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(ev) => setConfirmPassword(ev.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 pr-10"
                  placeholder="•••••••••"
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Проверка совпадения паролей */}
              {confirmPassword.length > 0 && (
                <div className={`text-sm flex items-center mt-1 ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch ? <CheckCircle className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
                  {passwordsMatch ? 'Пароли совпадают' : 'Пароли не совпадают'}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isCheckingPlayer || !passwordsMatch || passwordStrength.strength < 3}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/singin"
            className="text-gray-800 hover:text-gray-900 text-sm font-medium"
          >
            Уже есть аккаунт? Войти →
          </Link>
        </div>
        
        <Audio src="/audio/polet.mp3" />
      </div>
    </div>
  );
}