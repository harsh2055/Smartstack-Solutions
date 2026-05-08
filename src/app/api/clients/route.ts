import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const where = {
    ...(search ? {
      OR: [
        { companyName: { contains: search, mode: 'insensitive' as const } },
        { contactName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {}),
    ...(status === 'active' ? { isActive: true } : {}),
    ...(status === 'inactive' ? { isActive: false } : {}),
  };

  const [clients, total] = await Promise.all([
    db.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        projects: {
          select: { id: true, title: true, status: true, progress: true, deadline: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        invoices: { select: { id: true, total: true, status: true } },
        payments: { select: { id: true, amount: true, status: true } },
      },
    }),
    db.client.count({ where }),
  ]);

  return NextResponse.json({ clients, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { companyName, contactName, email, phone, website, industry, address, notes } = body;

    if (!companyName || !contactName || !email) {
      return NextResponse.json({ error: 'Company Name, Contact Name, and Email are required' }, { status: 400 });
    }

    // Check if client with this email already exists
    const existing = await db.client.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'A client with this email already exists' }, { status: 400 });
    }

    const client = await db.client.create({
      data: {
        companyName,
        contactName,
        email,
        phone,
        address,
        website,
        industry,
        notes,
      },
    });

    // Log the activity
    try {
      await db.activityLog.create({
        data: {
          clientId: client.id,
          type: 'CLIENT_CREATED',
          title: 'Client Created',
          message: `Client ${companyName} (${contactName}) was added to the system.`,
          createdBy: session.user?.name || 'Admin',
        },
      });
    } catch (logErr) {
      console.warn('Failed to create activity log for client creation:', logErr);
    }

    return NextResponse.json({
      ...client,
      projects: [],
      invoices: [],
      payments: [],
    }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/clients error:', err);
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A client with this email already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
