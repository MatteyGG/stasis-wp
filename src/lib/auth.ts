// stasis-wp\src\lib\auth.ts
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import { encode as defaultEncode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import { v4 as uuid } from "uuid";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { Adapter } from "next-auth/adapters";
import { compare } from "bcrypt-ts";
import { User } from "@prisma/client";

export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | null;
      username?: string | null;
      role?: string | null;
      rank?: string | null;
      created_at?: Date | null;
      approved?: boolean | null;
      gameID?: string | null;
      tgref?: string | null;
      techSlots?: Array<{
        type: string;
        slotIndex: number;
        nation: string | null;
        unit: string | null;
      }>;
    };
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    credentials?: boolean;
    userId?: string;
  }
}

const adapter = PrismaAdapter(prisma) as Adapter;

const authConfig: NextAuthConfig = {
  adapter,
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const user = await prisma.user.findFirst({
          where: {
            email: email as string,
          },
          include: {
            techSlots: true,
          },
        });

        if (!user?.password) {
          return null;
        }

        const isPasswordValid = typeof password === "string" && await compare(password, user.password as string);

        if (!isPasswordValid) {
          return null;
        }

        const userData = {
          id: user.id,
          username: user.username ?? "",
          name: user.username ?? "",
          email: user.email,
          role: user.role,
          rank: user.rank,
          created_at: user.created_at,
          approved: user.approved,
          gameID: user.gameID,
          tgref: user.tgref,
          techSlots: user.techSlots.map(slot => ({
            type: slot.type,
            slotIndex: slot.slotIndex,
            nation: slot.nation,
            unit: slot.unit
          }))
        };

        return userData;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
        token.userId = (user as User).id;
      }
      return token;
    },
    async session({ session, token }) {
      let userId: string | undefined;

      if (token?.userId) {
        userId = token.userId as string;
      } else if (session.user?.id) {
        userId = session.user.id;
      }

      if (userId) {
        const freshUser = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            techSlots: true
          }
        });

        if (freshUser) {
          session.user.id = freshUser.id;
          session.user.email = freshUser.email || "default@mail.com";
          session.user.username = freshUser.username || "NoNick";
          session.user.role = freshUser.role || "user"; 
          session.user.rank = freshUser.rank || "No rank";
          session.user.created_at = freshUser.created_at;
          session.user.approved = freshUser.approved;
          session.user.gameID = freshUser.gameID;
          session.user.tgref = freshUser.tgref || "";
          session.user.techSlots = freshUser.techSlots.map(slot => ({
            type: slot.type,
            slotIndex: slot.slotIndex,
            nation: slot.nation,
            unit: slot.unit
          }));
        }
      }
      
      return session;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  secret: process.env.AUTH_SECRET!,
  experimental: { enableWebAuthn: true },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
