import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Find client linked to this user's email
  const client = await db.client.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        include: {
          milestones: { orderBy: { order: 'asc' } },
          activityLogs: { orderBy: { createdAt: 'desc' }, take: 5 },
        },
        orderBy: { createdAt: 'desc' },
      },
      invoices: { orderBy: { createdAt: 'desc' } },
      tickets: { orderBy: { createdAt: 'desc' } },
      activityLogs: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });

  if (!client) {
    return NextResponse.json({ error: 'No client account found for this email' }, { status: 404 });
  }

  // Gate: client dashboard only accessible after contract is signed
  if (!client.contractSigned) {
    return NextResponse.json({ error: 'CONTRACT_NOT_SIGNED' }, { status: 403 });
  }

  return NextResponse.json(client);
}
