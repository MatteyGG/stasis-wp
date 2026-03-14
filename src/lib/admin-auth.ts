import { auth } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 as const };
  }

  if (!session.user.role?.includes("admin")) {
    return { error: "Forbidden", status: 403 as const };
  }

  return { session };
}
