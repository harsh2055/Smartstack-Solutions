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
  const status = searchParams.get('status');
  const clientId = searchParams.get('clientId');

  const tickets = await db.supportTicket.findMany({
    where: {
      ...(status ? { status: status as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' } : {}),
      ...(clientId ? { clientId } : {}),
    },
    include: {
      client: { select: { id: true, companyName: true, contactName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId, subject, description, priority } = body;

    if (!clientId || !subject || !description) {
      return NextResponse.json({ error: 'clientId, subject, and description are required' }, { status: 400 });
    }

    const ticket = await db.supportTicket.create({
      data: { clientId, subject, description, priority: priority || 'MEDIUM' },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (err) {
    console.error('POST /api/support error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...data } = body;

    const ticket = await db.supportTicket.update({
      where: { id },
      data: {
        ...data,
        ...(data.status === 'RESOLVED' ? { resolvedAt: new Date() } : {}),
      },
    });

    return NextResponse.json(ticket);
  } catch (err) {
    console.error('PATCH /api/support error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
