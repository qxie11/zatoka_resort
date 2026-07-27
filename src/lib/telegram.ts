export const sendTelegramNotification = async (message: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN || "8779062587:AAGxIcFMD-yPsJIuMqhHi8RKkwgZTrHiHBg";
  const chatId = process.env.TELEGRAM_CHAT_ID || "495881827";

  if (!token || !chatId) {
    console.warn("Telegram token or chatId is missing. Skipping admin notification.");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      console.error("Failed to send Telegram notification to admin:", await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error sending Telegram notification to admin:", error);
    return false;
  }
};

export const sendTelegramMessageToChat = async (chatId: string | number, message: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN || "8779062587:AAGxIcFMD-yPsJIuMqhHi8RKkwgZTrHiHBg";

  if (!token || !chatId) {
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error sending Telegram message to user:", error);
    return false;
  }
};
