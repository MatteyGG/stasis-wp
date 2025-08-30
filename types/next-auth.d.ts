// eslint-disable-next-line @typescript-eslint/no-unused-vars
// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string;
    role: string;
    rank: string;
    created_at: Date;
    approved: boolean;
    gameID: string;
    tgref: string;
    techSlots?: Array<{
      type: string;
      slotIndex: number;
      nation: string | null;
      unit: string | null;
    }>;
  }
}

declare module "next-auth" {
  type ExtendedSession = Session;

  interface User {
      id: string;
      email?: string | null;
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
  }


  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      rank: string;
      created_at: Date;
      approved: boolean;
      gameID: string;
      tgref: string;
      techSlots?: Array<{
        type: string;
        slotIndex: number;
        nation: string | null;
        unit: string | null;
      }>;
    };
  }
}

