import { signIn } from "../../auth";

export function SignIn(email, password) {
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
