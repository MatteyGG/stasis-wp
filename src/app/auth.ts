import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { Provider } from "next-auth/providers";

import { compare } from "bcrypt-ts";

import Credentials from "next-auth/providers/credentials";
import Yandex from "next-auth/providers/yandex";
import VK from "next-auth/providers/vk";

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
          email: credentials?.email,
        },
      });
      console.log(credentials, "//", user);
      if (!user) {
        return null;
      }

      const passwordCheck = await compare(credentials.password, user.password);
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
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.army = user.army;
        token.nation = user.nation;
        token.image = user.image;
      }
      return console.log('JWT token ---->', token.name), token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.username = token.username;
      session.user.role = token.role;
      session.user.army = token.army;
      session.user.nation = token.nation;
      return console.log("Session token ---->", token.name), session;
    },
  },
});

