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
import { CustomUser } from "next-auth";
import { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      gameID: number;
      email: string;
      username: string;
      role: string; // user or admin
      rank: string;
      army: string;
      nation: string;
      image: string;
      created_at: Date;
      approved: boolean;
      tgref: string;
    } & DefaultSession["user"];
  }

  interface CustomUser extends User {
    id: string;
    email: string;
    username: string;
    role: string; // user or admin
    rank: string;
    army: string;
    nation: string;
    image: string;
    created_at: Date;
    approved: boolean;
    gameID: number;
    tgref: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    gameID: number;
    tgref: string;
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

      const gamedata = await prisma.serverUser.findUnique({
        where: {
          id: Number(user.gameID),
        },
      });
      const passwordCheck = await compare(
        credentials.password as string,
        user.password
      );
      console.log(passwordCheck, credentials.password, user.password);
      if (!passwordCheck) {
        return null;
      }

      return {
        id: user.id.toString(),
        gameID: user.gameID,
        username: gamedata?.username,
        email: user.email,
        tgref: user.tgref,
        role: user.role?.toString(),
        rank: user.rank?.toString(),
        army: user.army?.toString(),
        nation: user.nation?.toString(),
        created_at: user.created_at,
        approved: user.approved,
      };
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
    jwt: ({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user: User | AdapterUser | CustomUser;
      trigger?: "signIn" | "signUp" | "update";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session?: any;
    }): JWT | null => {
      if (trigger === "update") {
        token.username = session.username;
        token.army = session.army;
        token.nation = session.nation;
        token.tgref = session.tgref;
      }
      if (
        user &&
        "id" in user &&
        "email" in user &&
        "username" in user &&
        "role" in user &&
        "army" in user &&
        "nation" in user &&
        "rank" in user &&
        "created_at" in user &&
        "gameID" in user &&
        "tgref" in user
      ) {
        // User is available during sign-in
        token.id = user.id!;
        token.email = user.email;
        token.username = user.username ?? "Не указано";
        token.role = user.role;
        token.rank = user.rank ?? "Не указано";
        token.army = user.army;
        token.nation = user.nation;
        token.image = user.image;
        token.approved = user.approved ?? false;
        token.created_at = user.created_at;
        token.gameID = user.gameID;
        token.tgref = user.tgref;
      }
      return token;
    },
    session({ session, token }) {
      if (!session || !session.user || !token) {
        throw new Error("Invalid session or token");
      }

      session.user.id = token.id ?? "unknown";
      session.user.email = token.email ?? "unknown";
      session.user.username = token.username?.toString() ?? "unknown";
      session.user.role = token.role?.toString() ?? "unknown";
      session.user.rank = token.rank?.toString() ?? "unknown";
      session.user.army = token.army?.toString() ?? "unknown";
      session.user.nation = token.nation?.toString() ?? "unknown";
      session.user.image = token.image?.toString() ?? "unknown";
      session.user.created_at = token.created_at as Date;
      session.user.approved = Boolean(token.approved) ?? false;
      session.user.gameID = token.gameID;
      session.user.tgref = token.tgref ?? "https://t.me/...";

      console.log("Session token ---->", token.name ?? "unknown");
      return session;
    },
  },
});


