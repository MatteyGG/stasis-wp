'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function updatePlayerData() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return { 
        success: false, 
        message: "Неавторизованный запрос" 
      };
    }

    // Получаем полные данные пользователя
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { player: true }
    });

    if (!user || !user.player) {
      return { 
        success: false, 
        message: "Пользователь или игрок не найден" 
      };
    }

    // Проверяем, прошло ли 12 часов с последнего обновления
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    
    if (user.player.lastUpdated && user.player.lastUpdated > twelveHoursAgo) {
      const nextUpdateTime = new Date(user.player.lastUpdated.getTime() + 12 * 60 * 60 * 1000);
      const hoursLeft = Math.ceil((nextUpdateTime.getTime() - Date.now()) / (1000 * 60 * 60));
      
      return { 
        success: false, 
        message: `Обновление возможно только раз в 12 часов. Следующее обновление через ${hoursLeft} часов`,
        nextUpdate: nextUpdateTime.toISOString()
      };
    }

    // Запрос к Warpath API для получения актуальных данных
    const warpathResponse = await fetch(`https://yx.dmzgame.com/intl_warpath/pid_detail?pid=${user.gameID}&page=1&perPage=1`);
    
    if (!warpathResponse.ok) {
      return { 
        success: false, 
        message: "Не удалось получить данные игрока из игры" 
      };
    }

    const warpathData = await warpathResponse.json();

    if (!warpathData.Data || warpathData.Data.length === 0) {
      return { 
        success: false, 
        message: "Игрок не найден в игре" 
      };
    }

    const rawPlayer = warpathData.Data[0];
    
    // Обновляем данные игрока
    const updatedPlayer = await prisma.player.update({
      where: { id: user.gameID },
      data: {
        warpathId: rawPlayer.pid,
        username: rawPlayer.nick,
        ally: rawPlayer.gnick,
        power: rawPlayer.power,
        kill: rawPlayer.sumkill,
        die: rawPlayer.die,
        kd: rawPlayer.sumkill / (rawPlayer.die || 1),
        resourceCollection: rawPlayer.caiji,
        techPower: rawPlayer.powers?.tech || 0,
        airPower: rawPlayer.powers?.army_air || 0,
        navyPower: rawPlayer.powers?.army_navy || 0,
        groundPower: rawPlayer.powers?.army_ground || 0,
        lastUpdated: new Date()
      }
    });

    return { 
      success: true, 
      message: "Данные игрока успешно обновлены",
      player: updatedPlayer
    };
  } catch (error) {
    console.error("Player update error:", error);
    return { 
      success: false, 
      message: "Ошибка сервера при обновлении данных" 
    };
  }
}