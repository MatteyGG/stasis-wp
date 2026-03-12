import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureMatrixUserForSiteUser } from "@/lib/matrix-registration";
import { NextRequest } from "next/server";

function validatePassword(password: string): string | null {
  if (!password || password.length < 8) {
    return "Пароль Matrix должен быть не короче 8 символов";
  }
  return null;
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ message: "Необходима авторизация" }, { status: 401 });
  }

  const body = await req.json();
  const displayName = String(body.displayName || "").trim();
  const password = String(body.password || "");

  if (!displayName) {
    return Response.json({ message: "Укажите отображаемое имя для Matrix" }, { status: 400 });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return Response.json({ message: passwordError }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      gameID: true,
      matrixMxid: true,
    },
  });

  if (!user) {
    return Response.json({ message: "Пользователь не найден" }, { status: 404 });
  }

  const provision = await ensureMatrixUserForSiteUser({
    gameID: user.gameID,
    displayName,
    password,
  });

  if (!provision.success || !provision.mxid) {
    return Response.json(
      {
        message: "Не удалось подключить Matrix. Проверьте настройки сервера.",
        reason: provision.reason || "unknown",
      },
      { status: 502 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      matrixMxid: provision.mxid,
      matrixDisplayName: displayName,
      matrixLinkedAt: new Date(),
      matrixProvisionStatus: "linked",
    },
  });

  return Response.json({
    message: user.matrixMxid
      ? "Параметры Matrix обновлены"
      : "Matrix успешно подключен",
    mxid: provision.mxid,
    displayName,
  });
}
