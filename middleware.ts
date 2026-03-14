import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const mustChangePassword = Boolean(req.auth?.user?.mustChangePassword);
  const isPasswordPage = pathname.startsWith("/profile/password");

  if (mustChangePassword && !isPasswordPage) {
    return NextResponse.redirect(new URL("/profile/password", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
