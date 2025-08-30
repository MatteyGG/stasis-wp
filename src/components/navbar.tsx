// components/navbar.tsx
import { auth } from "@/lib/auth";
import NavBar from "./navbar/NavBar";

export default async function Navbar() {
  const session = await auth();
  return <NavBar user={session?.user} />;
}