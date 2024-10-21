'use server'

import auth from "next-auth"; // Импортируем auth

export default async function UserName() {
  try {
    const session = await auth(); // Получаем сессию
    console.log("Текущая сессия:", session); // Логируем сессию для отладки

    // Проверяем, есть ли сессия и пользователь
    if (!session || !session.user) {
      return <h1>No name</h1>; // Если пользователь не авторизован
    }

    // Если пользователь авторизован, отображаем его имя
    return (
      <div>
        <h1>Welcome, {session.user.email}!</h1>
      </div>
    );
  } catch (error) {
    console.error("Ошибка при получении сессии:", error);
    return <h1>Error loading session</h1>;
  }
}