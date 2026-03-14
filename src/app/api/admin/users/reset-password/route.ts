import { NextResponse } from "next/server";
import { hash } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

function generateTemporaryPassword(length = 14) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%*_-";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}

function validatePassword(password: string) {
  if (!password || password.length < 8) {
    return "Пароль должен быть не короче 8 символов";
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const guard = await requireAdminSession();
    if ("error" in guard) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }

    const body = await req.json();
    const targetUserId = String(body.userId || "").trim();
    const providedPassword = String(body.temporaryPassword || "").trim();

    if (!targetUserId) {
      return NextResponse.json({ error: "userId обязателен" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, username: true, email: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    const temporaryPassword = providedPassword || generateTemporaryPassword();
    const validationError = validatePassword(temporaryPassword);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const hashedPassword = await hash(temporaryPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: targetUserId },
        data: {
          password: hashedPassword,
          mustChangePassword: true,
        },
      }),
      prisma.session.deleteMany({
        where: { userId: targetUserId },
      }),
      prisma.adminAuditLog.create({
        data: {
          adminUserId: guard.session.user.id,
          targetUserId: targetUser.id,
          action: "RESET_PASSWORD",
          details: {
            username: targetUser.username,
            email: targetUser.email,
            forcedPasswordChange: true,
          },
        },
      }),
    ]);

    return NextResponse.json({
      message: "Пароль успешно сброшен",
      temporaryPassword,
    });
  } catch (error) {
    console.error("Admin reset password error:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
