/**
 * Notification utility for Smartstack Solutions CRM.
 * Handles WhatsApp alerts via Twilio directly or via webhooks.
 */
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendWhatsAppNotification(to: string, message: string) {
  // 1. Try Direct Twilio Integration
  if (client && whatsappNumber) {
    try {
      console.log(`[WhatsApp] Sending direct message to ${to} via Twilio`);
      const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to.startsWith('+') ? to : '+' + to}`;
      
      const response = await client.messages.create({
        from: whatsappNumber,
        to: formattedTo,
        body: message,
      });
      
      return { success: true, sid: response.sid, method: 'twilio' };
    } catch (error: any) {
      console.error('[WhatsApp Error] Twilio Direct Failure:', {
        message: error.message,
        code: error.code,
        moreInfo: error.moreInfo
      });
      return { success: false, error: error.message, code: error.code, method: 'twilio' };
    }
  }

  // 2. Fallback to Webhook (Old method)
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      console.log(`[WhatsApp] Falling back to webhook: ${webhookUrl}`);
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message, timestamp: new Date().toISOString() }),
      });
      return { success: response.ok, method: 'webhook' };
    } catch (error) {
      console.error('[WhatsApp] Webhook Fallback Error:', error);
    }
  }

  // 3. Last Resort: Simulation
  console.log(`[WhatsApp Simulation] To: ${to}, Message: ${message}`);
  return { success: true, simulated: true };
}

export async function notifyNewInvoice(invoice: any) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://smartstack-solutions.vercel.app';
  const message = `🚀 *New Invoice from Smartstack Solutions*\n\n` +
    `Hello ${invoice.client.contactName},\n` +
    `A new invoice *${invoice.invoiceNo}* for *₹${invoice.total.toLocaleString()}* has been generated for your project: ${invoice.title}.\n\n` +
    `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}\n\n` +
    `You can view and pay it in your client portal: ${baseUrl}/profile`;
    
  if (invoice.client.phone) {
    return await sendWhatsAppNotification(invoice.client.phone, message);
  }
  return { success: false, error: 'No phone number provided' };
}

export async function notifyProjectUpdate(project: any, milestone: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://smartstack-solutions.vercel.app';
  const message = `✨ *Project Update: ${project.title}*\n\n` +
    `Great news! We've reached a new milestone: *${milestone}*\n\n` +
    `Track live progress here: ${baseUrl}/profile`;

  if (project.client.phone) {
    return await sendWhatsAppNotification(project.client.phone, message);
  }
  return { success: false, error: 'No phone number provided' };
}
