import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const teamMembers = await db.teamMember.findMany({
    orderBy: { joinedAt: 'desc' },
  });

  return NextResponse.json(teamMembers);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, role, department, skills } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'name, email, and role are required' }, { status: 400 });
    }

    const member = await db.teamMember.create({
      data: { name, email, role, department, skills: skills || [] },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/team error:', err);
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A team member with this email already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
