import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    
    const developer = await (db as any).developer.update({
      where: { id },
      data: {
        name: body.name,
        role: body.role,
        about: body.about,
        image: body.image,
        portfolio: body.portfolio,
        resume: body.resume,
        skills: body.skills,
        projects: body.projects,
        isActive: body.isActive,
      },
    });
    
    return NextResponse.json(developer);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update developer" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await (db as any).developer.delete({ where: { id } });
    return NextResponse.json({ message: "Developer deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete developer" }, { status: 500 });
  }
}
