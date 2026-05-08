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
  const clientId = searchParams.get('clientId');
  const status = searchParams.get('status') as ProjectStatus | null;

  const projects = await db.clientProject.findMany({
    where: {
      ...(clientId ? { clientId } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      client: { select: { id: true, companyName: true, contactName: true, email: true } },
      milestones: { orderBy: { order: 'asc' } },
      invoices: { select: { id: true, total: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { clientId, title, description, status, startDate, deadline, demoUrl, liveUrl, githubUrl, totalValue, notes, assignedTo } = body;

    if (!clientId || !title) {
      return NextResponse.json({ error: 'clientId and title are required' }, { status: 400 });
    }

    const project = await db.clientProject.create({
      data: {
        clientId,
        title,
        description,
        status: status || 'LEAD',
        startDate: startDate ? new Date(startDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        demoUrl,
        liveUrl,
        githubUrl,
        totalValue: totalValue || 0,
        notes,
        assignedTo,
      },
    });

    await db.activityLog.create({
      data: {
        clientId,
        projectId: project.id,
        type: 'PROJECT_CREATED',
        title: 'Project Created',
        message: `Project "${title}" was created.`,
        createdBy: session.user?.name || 'Admin',
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error('POST /api/projects error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
