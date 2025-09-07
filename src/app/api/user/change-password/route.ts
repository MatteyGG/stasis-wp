import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcrypt-ts";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { currentPassword, newPassword, userId } = body;

  try {
    // Если userId указан (для админа), проверяем права
    const targetUserId = userId || session.user.id;
    
    if (userId && session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Если не админ, проверяем текущий пароль
    if (!userId) {
      const isCurrentPasswordValid = await compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return Response.json({ error: "Current password is incorrect" }, { status: 400 });
      }
    }

    // Хэшируем новый пароль
    const hashedNewPassword = await hash(newPassword, 10);

    // Обновляем пароль
    await prisma.user.update({
      where: { id: targetUserId },
      data: { password: hashedNewPassword },
    });

    return Response.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}