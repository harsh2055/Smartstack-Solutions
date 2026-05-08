import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const client = await db.client.findUnique({
    where: { id },
    include: {
      projects: {
        include: { milestones: true, invoices: { select: { id: true, invoiceNo: true, total: true, status: true } } },
        orderBy: { createdAt: 'desc' },
      },
      invoices: { include: { payments: true }, orderBy: { createdAt: 'desc' } },
      payments: { orderBy: { createdAt: 'desc' } },
      tickets: { orderBy: { createdAt: 'desc' } },
      files: { orderBy: { createdAt: 'desc' } },
      activityLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
      leads: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  return NextResponse.json(client);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const client = await db.client.update({
      where: { id },
      data: body,
    });

    await db.activityLog.create({
      data: {
        clientId: id,
        type: 'CLIENT_UPDATED',
        title: 'Client Updated',
        message: `Client profile was updated.`,
        createdBy: session.user?.name || 'Admin',
      },
    });

    return NextResponse.json(client);
  } catch (err) {
    console.error('PATCH /api/clients/[id] error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.client.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/clients/[id] error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
