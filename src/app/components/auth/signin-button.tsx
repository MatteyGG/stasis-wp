import { signIn } from "../../../lib/auth";

export function SignIn(email: string, password: string) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn('credentials', { email: email, password: password });
      }}
    >
      <button type="submit">Войти</button>
    </form>
  );
}
