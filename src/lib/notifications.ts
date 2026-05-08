/**
 * Notification utility for Smartstack Solutions CRM.
 * Handles WhatsApp alerts via webhooks and other notification channels.
 */

export async function sendWhatsAppNotification(to: string, message: string) {
  // Simulate WhatsApp API call
  console.log(`[WhatsApp Simulation] To: ${to}, Message: ${message}`);
  
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  
  if (!webhookUrl) {
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        message,
        timestamp: new Date().toISOString()
      }),
    });
    
    return { success: response.ok, simulated: false };
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    return { success: false, error };
  }
}

export async function notifyNewInvoice(invoice: any) {
  const message = `🚀 *New Invoice from Smartstack Solutions*\n\n` +
    `Hello ${invoice.client.contactName},\n` +
    `A new invoice *${invoice.invoiceNo}* for *₹${invoice.total.toLocaleString()}* has been generated for your project: ${invoice.title}.\n\n` +
    `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}\n\n` +
    `You can view and pay it in your client portal: ${process.env.NEXTAUTH_URL}/profile`;
    
  if (invoice.client.phone) {
    return await sendWhatsAppNotification(invoice.client.phone, message);
  }
  return { success: false, error: 'No phone number provided' };
}

export async function notifyProjectUpdate(project: any, milestone: string) {
  const message = `✨ *Project Update: ${project.title}*\n\n` +
    `Great news! We've reached a new milestone: *${milestone}*\n\n` +
    `Track live progress here: ${process.env.NEXTAUTH_URL}/profile`;

  if (project.client.phone) {
    return await sendWhatsAppNotification(project.client.phone, message);
  }
  return { success: false, error: 'No phone number provided' };
}
