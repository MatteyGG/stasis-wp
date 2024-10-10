export default function Login() {
    return (
    <section className="auth m-8 flex flex-col items-center justify-center">
    <h1 className="text-3xl">Войти</h1>
    <form className="flex flex-col gap-4">
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
        Войти
      </button>
    </form>
    <br />
    <p className="text-center"><b>или</b></p>
    <br />
    <div className="flex flex-col justify-center">
    <button className="w-full">
      Войти с ЯндексID
    </button>
    </div>
  </section>
);
}