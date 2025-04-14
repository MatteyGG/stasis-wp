// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";
export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string;
    role: string;
    rank: string;
    army: string;
    nation: string;
    image: string;
    created_at: Date;
    approved: boolean;
    gameID: string;
    tgref: string;
  }
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  type ExtendedSession = Session;

  interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    rank: string;
    army: string;
    nation: string;
    image: string;
    created_at: Date;
    approved: boolean;
    gameID: string;
    tgref: string;
  }

  interface Session extends DefaultSession {
    id: string;
    username: string;
    email: string;
    role: string;
    rank: string;
    army: string;
    nation: string;
    image: string;
    created_at: Date;
    approved: boolean;
    gameID: string;
    tgref: string;
  }
}
