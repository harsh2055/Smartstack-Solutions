import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, firstName, lastName, email, phone, company, companySize, service, budget, message } = body;

    const finalName = name || `${firstName || ''} ${lastName || ''}`.trim();

    if (!email || !message || !finalName) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    // Save as a lead in the database (always works, no SMTP required)
    await db.lead.create({
        data: {
          name: finalName,
          email,
          phone: phone || null,
          company: company || null,
          message: message || null,
          service: service || null,
          budget: budget || null,
          source: 'WEBSITE',
        },
    });

    // Optionally send email notification (silent fail if SMTP not configured)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const { sendContactEmail } = await import('@/lib/mail');
        await sendContactEmail(
          process.env.ADMIN_EMAIL || 'admin@smartstack-solutions.com',
          finalName,
          email,
          message,
          companySize
        );
      } catch (emailErr) {
        console.warn('Email notification failed (non-critical):', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
