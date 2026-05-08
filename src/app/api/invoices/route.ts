import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/prisma';
import { notifyNewInvoice } from '@/lib/notifications';

function generateInvoiceNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${year}${month}-${rand}`;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const where = {
    ...(clientId ? { clientId } : {}),
    ...(status ? { status: status as 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED' } : {}),
  };

  const [invoices, total, summary] = await Promise.all([
    db.invoice.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, companyName: true, contactName: true, email: true } },
        payments: { select: { id: true, amount: true, status: true } },
      },
    }),
    db.invoice.count({ where }),
    db.invoice.aggregate({
      _sum: { total: true },
      where: { status: 'PAID' },
    }),
  ]);

  const pendingSum = await db.invoice.aggregate({
    _sum: { total: true },
    where: { status: { in: ['PENDING', 'OVERDUE'] } },
  });

  return NextResponse.json({
    invoices,
    total,
    page,
    limit,
    stats: {
      totalRevenue: summary._sum.total || 0,
      pendingAmount: pendingSum._sum.total || 0,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { clientId, projectId, title, items, subtotal, tax, total, dueDate, notes, status } = body;

    if (!clientId || !title || !items || total === undefined) {
      return NextResponse.json({ error: 'clientId, title, items, and total are required' }, { status: 400 });
    }

    const invoice = await db.invoice.create({
      data: {
        clientId,
        projectId: projectId || null,
        invoiceNo: generateInvoiceNo(),
        title,
        items,
        subtotal: subtotal || 0,
        tax: tax || 0,
        total,
        status: status || 'PENDING',
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
      },
      include: {
        client: { select: { id: true, companyName: true, contactName: true, email: true } },
      },
    });

    await db.activityLog.create({
      data: {
        clientId,
        type: 'INVOICE_CREATED',
        title: 'Invoice Created',
        message: `Invoice ${invoice.invoiceNo} for ₹${total} was created.`,
        createdBy: session.user?.name || 'Admin',
      },
    });

    // Send WhatsApp Notification (Async)
    notifyNewInvoice(invoice).catch(err => console.error('WhatsApp notify error:', err));

    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    console.error('POST /api/invoices error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
