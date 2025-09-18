"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!email || !password) {
      toast.error("Заполните все поля");
      return;
    }

    setIsLoading(true);

    try {
      const signInData = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInData?.error) {
        toast.error("Неверные учетные данные");
      } else {
        toast.success("Вход выполнен успешно!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Произошла ошибка при входе");
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Вход</h1>
          <p className="mt-2 text-gray-600">
            Введите свои учетные данные для входа
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
          <div className="space-y-4">
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
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="•••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500 disabled:opacity-50"
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/registration"
            className="text-black-600 hover:text-black-500 text-sm font-medium"
          >
            Зарегистрироваться →
          </Link>
        </div>
      </div>
      
      {/* Контейнер для уведомлений */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}