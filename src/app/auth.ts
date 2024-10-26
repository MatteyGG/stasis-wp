import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { Provider } from "next-auth/providers";

import { compare } from "bcrypt-ts";

import Credentials from "next-auth/providers/credentials";
import Yandex from "next-auth/providers/yandex";
import VK from "next-auth/providers/vk";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "@auth/core/adapters";
import { User } from "next-auth";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      role: string; // user or admin
      army: string;
      nation: string;
      image: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {


      if (!credentials?.email && !credentials?.password) {
        return null;
      }
      const user = await prisma.user.findUnique({
        where: {
          email: credentials.email as string,
        },
      });
      console.log(credentials, "//", user);
      if (!user) {
        return null;
      }

      const passwordCheck = await compare(credentials.password as string, user.password);
      console.log(passwordCheck, credentials.password, user.password)
      if (!passwordCheck) {
        return null
      }

      return {id: user.id.toString(), username: user.username, image: user.image?.toString(), email: user.email, role: user.role?.toString(), army: user.army?.toString(), nation: user.nation?.toString()};

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

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }: { token: JWT, user: User | AdapterUser }) {
      if (user && 'id' in user && 'email' in user && 'username' in user && 'role' in user && 'army' in user && 'nation' in user) {
        // User is available during sign-in
        token.id = user.id!;
        token.email = user.email;
        token.username = user.username ?? 'Не указано';
        token.role = user.role;
        token.army = user.army;
        token.nation = user.nation;
        token.image = user.image;
      }
      return console.log('JWT token ---->', token.name), token;
    },
    session({ session, token }) {
      if (!session || !session.user || !token) {
        throw new Error("Invalid session or token");
      }
      
      session.user.id = token.id ?? "unknown";
      session.user.email = token.email ?? "unknown";
      session.user.username = token.username?.toString() ?? "unknown";
      session.user.role = token.role?.toString() ?? "unknown";
      session.user.army = token.army?.toString() ?? "unknown";
      session.user.nation = token.nation?.toString() ?? "unknown";
      
      console.log("Session token ---->", token.name ?? "unknown");
      return session;
    },
  },
});

