import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { Provider } from "next-auth/providers";

import { compare } from "bcrypt-ts";

import Credentials from "next-auth/providers/credentials";
import Yandex from "next-auth/providers/yandex";
import VK from "next-auth/providers/vk";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {

      role: string;	//user or admin
      image: string;
    } & DefaultSession["user"];
  }
}

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(request) {
      
      if (!request?.email && !request?.password) {
        return null;
      }
      
      const user = await prisma.user.findUnique({
        where: {
          email: request?.email,
        },
      });
      console.log(request, "//", user);
      if (!user) {
        return null;
      }

      const hash = 10;
      const passwordCheck = await compare(request.password, user.password);

      if (!passwordCheck) {
        return user;
      }
    },
  }),
  // ...add more providers here
  Yandex,
  VK,
];


export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

const config = {
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          address: user.address,
        },
      };
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}