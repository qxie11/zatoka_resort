import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// After verifying a domain at resend.com/domains, change this back to "zatokahotelresort@gmail.com"
// and set RESEND_FROM_EMAIL="noreply@your-verified-domain.com" in .env
const NOTIFY_EMAIL = process.env.RESEND_NOTIFY_EMAIL || "zatokahotelresort@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

// ─── Callback / Заявка обратного звонка ───────────────────────────────────────

export async function sendCallbackNotification(data: {
  name: string;
  phone: string;
  message?: string;
}) {
  console.log("[Resend] Sending callback notification to", NOTIFY_EMAIL, "from", FROM_EMAIL);
  console.log("[Resend] API key present:", !!process.env.RESEND_API_KEY);
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `📞 Новая заявка на обратный звонок — ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Новая заявка</title>
        </head>
        <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#0d9488,#0ea5e9);padding:28px 32px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">Затока Resort</p>
                            <h1 style="margin:6px 0 0;font-size:22px;font-weight:800;color:#ffffff;">📞 Новая заявка на звонок</h1>
                          </td>
                          <td align="right">
                            <div style="background:rgba(255,255,255,0.15);border-radius:50%;width:52px;height:52px;display:inline-flex;align-items:center;justify-content:center;font-size:24px;">
                              📲
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:32px;">
                      <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.6;">
                        Гость оставил заявку на обратный звонок. Пожалуйста, свяжитесь с ним как можно скорее.
                      </p>

                      <!-- Info Cards -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                        <tr>
                          <td style="background:#0f172a;border-radius:12px;padding:16px 20px;border-left:3px solid #0d9488;">
                            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Имя гостя</p>
                            <p style="margin:0;font-size:18px;font-weight:700;color:#f1f5f9;">${data.name}</p>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                        <tr>
                          <td style="background:#0f172a;border-radius:12px;padding:16px 20px;border-left:3px solid #0ea5e9;">
                            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Номер телефона</p>
                            <p style="margin:0;font-size:22px;font-weight:800;color:#38bdf8;">${data.phone}</p>
                          </td>
                        </tr>
                      </table>

                      ${data.message ? `
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                        <tr>
                          <td style="background:#0f172a;border-radius:12px;padding:16px 20px;border-left:3px solid #8b5cf6;">
                            <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Сообщение</p>
                            <p style="margin:0;font-size:14px;color:#e2e8f0;line-height:1.6;">${data.message}</p>
                          </td>
                        </tr>
                      </table>
                      ` : ""}

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#0f172a;padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0;font-size:12px;color:#475569;text-align:center;">
                        Затока Resort · Автоматическое уведомление · ${new Date().toLocaleString("ru-UA", { timeZone: "Europe/Kiev" })}
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    console.log("[Resend] Callback email sent successfully:", result);
  } catch (error) {
    console.error("[Resend] Failed to send callback notification:", JSON.stringify(error, null, 2));
    // Do not throw — email failure should not break the API
  }
}

// ─── Booking / Бронирование ────────────────────────────────────────────────────

export async function sendBookingNotification(data: {
  name: string;
  phone: string;
  email?: string;
  roomId: string;
  roomName?: string;
  startDate: Date | string;
  endDate: Date | string;
  pricePaid?: number;
  promoCode?: string;
  discountApplied?: number;
}) {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const formatDate = (d: Date) =>
    d.toLocaleDateString("ru-UA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Kiev",
    });

  console.log("[Resend] Sending booking notification to", NOTIFY_EMAIL, "from", FROM_EMAIL);
  console.log("[Resend] API key present:", !!process.env.RESEND_API_KEY);
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `🏨 Новое бронирование — ${data.name} (${formatDate(start)})`,
      html: `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Новое бронирование</title>
        </head>
        <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#0d9488,#0ea5e9);padding:28px 32px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">Затока Resort</p>
                            <h1 style="margin:6px 0 0;font-size:22px;font-weight:800;color:#ffffff;">🏨 Новое бронирование</h1>
                          </td>
                          <td align="right">
                            <div style="background:rgba(255,255,255,0.15);border-radius:50%;width:52px;height:52px;text-align:center;line-height:52px;font-size:24px;">
                              📅
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Badge: nights -->
                  <tr>
                    <td style="padding:24px 32px 0;">
                      <div style="display:inline-block;background:rgba(14,165,233,0.12);border:1px solid rgba(14,165,233,0.25);border-radius:50px;padding:6px 16px;">
                        <span style="font-size:13px;font-weight:700;color:#38bdf8;">
                          🌙 ${nights} ${nights === 1 ? "ночь" : nights < 5 ? "ночи" : "ночей"}
                        </span>
                      </div>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:20px 32px 32px;">

                      <!-- Guest info -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                        <tr>
                          <td style="background:#0f172a;border-radius:12px;padding:16px 20px;border-left:3px solid #0d9488;">
                            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Гость</p>
                            <p style="margin:0;font-size:18px;font-weight:700;color:#f1f5f9;">${data.name}</p>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="12px" style="margin-bottom:0;">
                        <tr>
                          <td width="50%" style="padding-right:6px;">
                            <div style="background:#0f172a;border-radius:12px;padding:16px 20px;border-left:3px solid #0ea5e9;">
                              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Телефон</p>
                              <p style="margin:0;font-size:16px;font-weight:700;color:#38bdf8;">${data.phone}</p>
                            </div>
                          </td>
                          <td width="50%" style="padding-left:6px;">
                            <div style="background:#0f172a;border-radius:12px;padding:16px 20px;border-left:3px solid #8b5cf6;">
                              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Email</p>
                              <p style="margin:0;font-size:14px;font-weight:600;color:#c4b5fd;">${data.email || "—"}</p>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Divider -->
                      <div style="height:1px;background:rgba(255,255,255,0.06);margin:20px 0;"></div>

                      <!-- Booking details -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                        <tr>
                          <td style="background:#0f172a;border-radius:12px;padding:16px 20px;border-left:3px solid #f59e0b;">
                            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Номер / Room ID</p>
                            <p style="margin:0;font-size:16px;font-weight:700;color:#fcd34d;">${data.roomName || data.roomId}</p>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="12px" style="margin-bottom:12px;">
                        <tr>
                          <td width="50%" style="padding-right:6px;">
                            <div style="background:#0f172a;border-radius:12px;padding:16px 20px;">
                              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Заезд</p>
                              <p style="margin:0;font-size:15px;font-weight:700;color:#f1f5f9;">✈️ ${formatDate(start)}</p>
                            </div>
                          </td>
                          <td width="50%" style="padding-left:6px;">
                            <div style="background:#0f172a;border-radius:12px;padding:16px 20px;">
                              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Выезд</p>
                              <p style="margin:0;font-size:15px;font-weight:700;color:#f1f5f9;">🏁 ${formatDate(end)}</p>
                            </div>
                          </td>
                        </tr>
                      </table>

                      ${data.pricePaid ? `
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                        <tr>
                          <td style="background:linear-gradient(135deg,rgba(13,148,136,0.15),rgba(14,165,233,0.15));border-radius:12px;padding:16px 20px;border:1px solid rgba(13,148,136,0.3);">
                            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Сумма к оплате</p>
                            <p style="margin:0;font-size:26px;font-weight:900;color:#2dd4bf;">₴ ${data.pricePaid.toLocaleString("ru-UA")}</p>
                            ${data.promoCode ? `<p style="margin:4px 0 0;font-size:12px;color:#64748b;">Промокод: <b style="color:#a78bfa;">${data.promoCode}</b>${data.discountApplied ? ` (−${data.discountApplied}%)` : ""}</p>` : ""}
                          </td>
                        </tr>
                      </table>
                      ` : ""}

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#0f172a;padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0;font-size:12px;color:#475569;text-align:center;">
                        Затока Resort · Автоматическое уведомление · ${new Date().toLocaleString("ru-UA", { timeZone: "Europe/Kiev" })}
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    console.log("[Resend] Booking email sent successfully:", result);
  } catch (error) {
    console.error("[Resend] Failed to send booking notification:", JSON.stringify(error, null, 2));
    // Do not throw — email failure should not break the API
  }
}
