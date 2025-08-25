import { SessionProvider } from "next-auth/react";
import UserProfile from "../UserProfile";

export default function Profile() {
  return (
    <SessionProvider>
      <UserProfile />
    </SessionProvider>
  );
}
