import Link from "next/link";

export default function Login() {
  return (
    <div className="flex mt-12 items-center justify-center">
      <section className="auth backdrop-blur-sm rounded-6xl shadow-xl">
        <h1 className="text-3xl">Регистрация</h1>
        <form className="flex flex-col gap-3">
          <label>
            <span>Почта</span>
            <input
              type="email"
              name="email"
              placeholder="podgoroy@example.com"
              autoComplete="email"
            />
          </label>
          <label>
            <span>Пароль</span>
            <input
              type="password"
              name="password"
              autoComplete="password"
              placeholder="•••••••••"
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
