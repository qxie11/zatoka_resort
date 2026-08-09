// This is a Mock SMS Gateway implementation.
// When you are ready to use a real provider (e.g. TurboSMS, Twilio), 
// replace this logic with their API SDK or HTTP calls.

export async function sendPromoSMS(data: {
  phones: string[];
  promoCode: string;
  discount: number;
  customMessage?: string;
}) {
  console.log(`[SMS Gateway] Initiating SMS broadcast to ${data.phones.length} recipients...`);

  const defaultMessage = `Скидка ${data.discount}% на отдых! Используйте промокод ${data.promoCode} на zatoka-hotel.com`;
  const messageBody = data.customMessage || defaultMessage;

  let successCount = 0;
  let errorCount = 0;

  // Mock delay to simulate network requests
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  for (const phone of data.phones) {
    try {
      // Simulate sending SMS
      await delay(50); // 50ms per SMS mock
      
      // In a real implementation, you would check the response status here.
      // Example for TurboSMS: await fetch('https://api.turbosms.ua/message/send.json', ...)
      
      console.log(`[SMS Gateway] 📲 Sent to ${phone}: "${messageBody}"`);
      successCount++;
    } catch (error) {
      console.error(`[SMS Gateway] ❌ Failed to send to ${phone}:`, error);
      errorCount++;
    }
  }

  console.log(`[SMS Gateway] Broadcast complete. Success: ${successCount}, Errors: ${errorCount}`);
  
  return { successCount, errorCount };
}
