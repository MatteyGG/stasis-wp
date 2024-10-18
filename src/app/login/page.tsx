import Link from "next/link";

import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/app/auth";
import { AuthError } from "next-auth";

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  return (
    <div className="flex mt-12 items-center justify-center">
      <section className="auth backdrop-blur-sm rounded-6xl shadow-xl gap-4">
        <h1 className="text-3xl">Вход</h1>
        <form
          action={async (formData) => {
            "use server";
            try {
              await signIn("credentials", formData);
            } catch (error) {
              if (error instanceof AuthError) {
                return console.log('- error: ', error);
              }
              throw error;
            }
          }}
        >
          <label htmlFor="email">
            Email
            <input name="email" id="email" />
          </label>
          <label htmlFor="password">
            Password
            <input name="password" id="password" />
          </label>
          <input type="submit" value="Sign In" />
        </form>
        <p className="text-center">
          <b>или</b>
        </p>
        {Object.values(providerMap).map((provider) => (
          <form
            className="w-full"
            key={provider.id}
            action={async () => {
              "use server";
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
