import { SessionProvider } from "next-auth/react";
import UserProf from "./UserProfile";

export default function Profile() {
  return (
    <SessionProvider>
      <UserProf />
    </SessionProvider>
  );
}
