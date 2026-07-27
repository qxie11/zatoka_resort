import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const token = process.env.TELEGRAM_BOT_TOKEN || "8779062587:AAGxIcFMD-yPsJIuMqhHi8RKkwgZTrHiHBg";

async function sendTelegramMessage(chatId: number | string, text: string, replyMarkup?: any) {
  try {
    const body: any = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    };
    if (replyMarkup) {
      body.reply_markup = replyMarkup;
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.ok;
  } catch (err) {
    console.error("Error sending message to chatId", chatId, err);
    return false;
  }
}

async function processUpdate(update: any) {
  const message = update?.message;
  if (!message || !message.chat || !message.text) return;

  const chatId = message.chat.id;
  const text = message.text.trim();
  const firstName = message.chat.first_name || "Гость";

  console.log(`[Telegram Bot] Received message from ${firstName} (${chatId}): ${text}`);

  if (text.startsWith("/start")) {
    const parts = text.split(" ");
    const param = parts[1]; // e.g. "booking_036ba601-bb9c-4c22-ad90-8890567e6b2d"

    if (param) {
      const bookingId = param.replace(/^booking_/, "");

      let booking = null;
      try {
        booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { room: true },
        });
      } catch (e) {
        console.error("DB error fetching booking:", e);
      }

      const inlineKeyboard = {
        inline_keyboard: [
          [
            { text: "🟣 Написать в Viber", url: "https://msng.link/o?380669212275=vi" },
            { text: "🔵 Написать в Telegram", url: "https://t.me/+380669212275" },
          ],
        ],
      };

      if (booking) {
        const startStr = new Date(booking.startDate).toLocaleDateString("ru-RU");
        const endStr = new Date(booking.endDate).toLocaleDateString("ru-RU");
        const roomName = booking.room?.name || "Номер в Zatoka Resort";

        const voucherMsg =
          `🎉 <b>Ваше бронирование подтверждено!</b>\n` +
          `🎫 <b>Номер ваучера:</b> №${booking.id}\n\n` +
          `🏨 <b>Категория:</b> ${roomName}\n` +
          `👤 <b>Гость:</b> ${booking.name}\n` +
          `📅 <b>Даты:</b> ${startStr} — ${endStr}\n` +
          (booking.pricePaid ? `💰 <b>Сумма к оплате:</b> ${booking.pricePaid} грн\n\n` : "\n") +
          `📍 <b>Адрес:</b> ул. Садовая, 1835, ст. Лиманская, Затока, Одесская обл.\n` +
          `📞 <b>Телефон:</b> +380669212275\n` +
          `⏰ <b>Время заезда:</b> с 14:00 | <b>Выезда:</b> до 12:00\n\n` +
          `Используйте кнопки ниже для связи с администрацией 👇`;

        await sendTelegramMessage(chatId, voucherMsg, inlineKeyboard);
      } else {
        const fallbackMsg =
          `Здравствуйте, ${firstName}! 👋\n\n` +
          `Ваш запрос на получение ваучера принят.\n` +
          `Используйте кнопки ниже для быстрой связи с администратором:`;

        await sendTelegramMessage(chatId, fallbackMsg, inlineKeyboard);
      }
    } else {
      const welcomeMsg =
        `Здравствуйте, ${firstName}! 👋\n\n` +
        `Вас приветствует официальный бот <b>Zatoka Resort</b>! 🌊\n` +
        `Здесь вы получаете электронные ваучеры и подтверждения бронирований.`;

      const inlineKeyboard = {
        inline_keyboard: [
          [
            { text: "🟣 Viber", url: "https://viber.me/380669212275" },
            { text: "🔵 Telegram", url: "https://t.me/+380669212275" },
          ],
        ],
      };

      await sendTelegramMessage(chatId, welcomeMsg, inlineKeyboard);
    }
  }
}

async function startPolling() {
  console.log("🚀 Starting Telegram Bot Long-Poller Service...");
  let offset = 0;

  while (true) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=10`
      );
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          await processUpdate(update);
          offset = update.update_id + 1;
        }
      }
    } catch (err) {
      console.error("[Telegram Poller] Network/Polling error:", err);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

startPolling();
