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
  const status = searchParams.get('status') as string | null;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const where = {
    ...(search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { company: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {}),
    ...(status ? { status: status as any } : {}),
  };

  const [leads, total] = await Promise.all([
    db.lead.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    db.lead.count({ where }),
  ]);

  const counts = await db.lead.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  return NextResponse.json({ leads, total, page, limit, counts });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, service, budget, value, message, source, status, notes, assignedTo } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        service: service || null,
        budget: budget || null,
        value: value !== undefined ? parseFloat(String(value)) : null,
        message: message || null,
        source: source || 'Manual',
        status: status || 'NEW',
        assignedTo: assignedTo || null,
        notes: notes || null,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/leads error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
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

    const lead = await db.lead.update({
      where: { id },
      data: {
        ...data,
        ...(data.followUpDate ? { followUpDate: new Date(data.followUpDate) } : {}),
      },
    });

    return NextResponse.json(lead);
  } catch (err) {
    console.error('PATCH /api/leads error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
