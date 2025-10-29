// components/navbar.tsx
import { auth } from "@/lib/auth";
import NavBar from "./navbar/NavBar";

export default async function Navbar() {
  const session = await auth();

    if (!session?.user) {
      return
    }
  const { user } = session;

  return <NavBar user={user} />;
}