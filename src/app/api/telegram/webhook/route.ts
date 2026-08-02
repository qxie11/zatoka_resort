import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify Telegram payload structure
    const message = body?.message;
    if (!message || !message.chat || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const token = process.env.TELEGRAM_BOT_TOKEN || "8779062587:AAGxIcFMD-yPsJIuMqhHi8RKkwgZTrHiHBg";

    // Check if command is /start with payload
    if (text.startsWith('/start')) {
      const parts = text.split(' ');
      const param = parts[1]; // e.g. "booking_12345"

      const inlineKeyboard = {
        inline_keyboard: [
          [
            { text: "🟣 Написать в Viber", url: "https://viber.me/380669212275" },
            { text: "🔵 Написать в Telegram", url: "https://t.me/+380669212275" },
          ],
        ],
      };

      if (param) {
        const bookingId = param.replace(/^booking_/, '');

        let bookingInfo = null;
        try {
          bookingInfo = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { room: true },
          });
        } catch (dbErr) {
          console.error("Error fetching booking for telegram bot:", dbErr);
        }

        if (bookingInfo) {
          const startDateStr = new Date(bookingInfo.startDate).toLocaleDateString('ru-RU');
          const endDateStr = new Date(bookingInfo.endDate).toLocaleDateString('ru-RU');
          const roomName = bookingInfo.room?.name || 'Номер в Grean Beam';

          const voucherMsg = 
            `🎉 <b>Ваше бронирование подтверждено!</b>\n` +
            `🎫 <b>Номер ваучера:</b> №${bookingInfo.id}\n\n` +
            `🏨 <b>Категория:</b> ${roomName}\n` +
            `👤 <b>Гость:</b> ${bookingInfo.name}\n` +
            `📅 <b>Даты:</b> ${startDateStr} — ${endDateStr}\n` +
            (bookingInfo.pricePaid ? `💰 <b>Сумма:</b> ${bookingInfo.pricePaid} грн\n\n` : '\n') +
            `📍 <b>Адрес:</b> ул. Садовая, 1835, ст. Лиманская, Затока, Одесская обл.\n` +
            `📞 <b>Телефон:</b> +380669212275\n` +
            `⏰ <b>Заезд:</b> с 14:00 | <b>Выезд:</b> до 12:00\n\n` +
            `Используйте кнопки ниже для связи с администрацией 👇`;

          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: voucherMsg,
              parse_mode: "HTML",
              reply_markup: inlineKeyboard,
            }),
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in Telegram webhook route:", error);
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Grean Beam Telegram Webhook Endpoint Active" });
}
