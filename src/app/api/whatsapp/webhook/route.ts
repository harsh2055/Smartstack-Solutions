import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';

  try {
    // 1. Handle Outgoing Messages (Internal Trigger from CRM)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { to, message } = body;

      if (!client) {
        console.warn('[WhatsApp Webhook] Twilio client not initialized. Check SID/Token.');
        return NextResponse.json({ error: 'Twilio not configured' }, { status: 500 });
      }

      console.log(`[WhatsApp Webhook] Sending outgoing message to ${to}`);

      // Ensure the number is in WhatsApp format
      const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to.startsWith('+') ? to : '+' + to}`;

      const response = await client.messages.create({
        from: whatsappNumber,
        to: formattedTo,
        body: message,
      });

      return NextResponse.json({ success: true, sid: response.sid });
    }

    // 2. Handle Incoming Messages (From Twilio Sandbox)
    // Twilio sends application/x-www-form-urlencoded
    const formData = await req.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;

    console.log(`[WhatsApp Webhook] Received message from ${from}: ${body}`);

    // Here you could save the message to your database or trigger a chat response
    // For now, we'll just acknowledge receipt to Twilio

    const twiml = new twilio.twiml.MessagingResponse();
    // Optional: Respond to the user
    // twiml.message('Thanks for contacting Smartstack Solutions! An agent will get back to you soon.');

    return new Response(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });

  } catch (error: any) {
    console.error('[WhatsApp Webhook] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
