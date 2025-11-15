// lib/sendTextByTelegram.ts

interface SendTelegramOptions {
  /**
   * ID чата, в который отправляем сообщение.
   * По умолчанию берётся из переменной окружения TELEGRAM_CHAT_ID.
   */
  chatId?: string;

  /**
   * URL изображения или file_id Telegram.
   * Если указан, вместо sendMessage используется sendPhoto,
   * а текст отправляется как caption под картинкой.
   */
  photo?: string;
}

/**
 * Отправляет сообщение в Telegram.
 *
 * Если передано только `text` — отправляется обычное сообщение (sendMessage).
 * Если дополнительно указано `photo` — отправляется фото с подписью (sendPhoto),
 * где `text` используется как caption.
 *
 * Используется HTML-разметка (`parse_mode: "HTML"`), поэтому можно
 * использовать теги <b>, <i>, <code>, <a href="..."> и т.д.
 *
 * @param text   Текст сообщения или подписи к фото (HTML поддерживается).
 * @param options Дополнительные опции:
 *  - chatId: ID чата (по умолчанию TELEGRAM_CHAT_ID)
 *  - photo: URL или file_id изображения; если указан — используется sendPhoto
 * 
 * @example
 *     await sendTextByTelegram( `📝 <b>Новая статья!</b>\n\nЧитай по ссылке ниже 👇`, { photo: "https://stasis-wp.ru/static/wiki/preview.jpg", } );
 * 
 */
export const sendTextByTelegram = async (
  text: string,
  options: SendTelegramOptions = {}
): Promise<void> => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = options.chatId || process.env.TELEGRAM_CHAT_ID || "";
  const photo = options.photo;

  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN is not set");
    return;
  }

  if (!chatId) {
    console.error("TELEGRAM_CHAT_ID is not set and chatId was not provided");
    return;
  }

  try {
    const endpoint = photo ? "sendPhoto" : "sendMessage";
    const url = `https://api.telegram.org/bot${token}/${endpoint}`;

    const payload: Record<string, unknown> = {
      chat_id: chatId,
      parse_mode: "HTML",
    };

    if (photo) {
      payload.photo = photo;
      payload.caption = text;
    } else {
      payload.text = text;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Telegram message sent:", data);
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
};
