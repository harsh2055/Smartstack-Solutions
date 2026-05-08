import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppNotification } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ 
      error: 'Please provide a phone number in the URL: ?phone=919876543210' 
    }, { status: 400 });
  }

  try {
    console.log(`[WhatsApp Test] Triggering test for ${phone}`);
    const result = await sendWhatsAppNotification(phone, '🔔 *Smartstack Test*: If you can see this, your WhatsApp automation is working perfectly!');
    
    return NextResponse.json({ 
      message: 'Test triggered! Check your WhatsApp and Vercel logs.',
      result 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
