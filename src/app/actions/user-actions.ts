'use server';

import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcrypt-ts";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error: string | null;
  success: string | null;
};

export async function changePassword(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Не авторизован", success: null };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Валидация
    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: "Все поля обязательны для заполнения", success: null };
    }

    if (newPassword !== confirmPassword) {
      return { error: "Новые пароли не совпадают", success: null };
    }

    if (newPassword.length < 6) {
      return { error: "Пароль должен содержать минимум 6 символов", success: null };
    }

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { error: "Пользователь не найден", success: null };
    }

    // Проверяем текущий пароль
    const isCurrentPasswordValid = await compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return { error: "Текущий пароль неверен", success: null };
    }

    // Хэшируем новый пароль
    const hashedNewPassword = await hash(newPassword, 10);

    // Обновляем пароль
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword },
    });

    revalidatePath("/profile");
    return { error: null, success: "Пароль успешно изменен" };
  } catch (error) {
    console.error("Password change error:", error);
    return { error: "Внутренняя ошибка сервера", success: null };
  }
}