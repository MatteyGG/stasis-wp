import { NextAuthConfig } from "next-auth";
import NextAuth, { User, Session } from "next-auth";
import { encode as defaultEncode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Facebook from "next-auth/providers/facebook";
import Github from "next-auth/providers/github";
import Passkey from "next-auth/providers/passkey";
import { prisma } from "./prisma";
import { compare } from "bcrypt-ts";

// Importing the v4 function from the 'uuid' package and aliasing it as 'uuid'
import { v4 as uuid } from "uuid";

import { PrismaAdapter } from "@auth/prisma-adapter";

type ExtendedSession = Session & {
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
};

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
    }),
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
            email,
          },
        });

        if (!user?.password) {
          return null;
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
        } as User;
      },
    }),
    Passkey,
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    async session({ session, user, token }) {
      if (token?.credentials) {
        session.id = user.id;
        session.email = user.email;
        session.username = user.username;
        session.role = user.role;
        session.rank = user.rank;
        session.army = user.army;
        session.nation = user.nation;
        session.image = user.image;
        session.created_at = user.created_at;
        session.approved = user.approved;
        session.gameID = user.gameID;
        session.tgref = user.tgref;
      }
      return session as ExtendedSession;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await prisma.session.create({
          data: {
            sessionToken,
            userId: params.token.sub,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
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

