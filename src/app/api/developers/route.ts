import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    
    const developers = await (db as any).developer.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { role: { contains: search, mode: "insensitive" } },
        ],
      } : {},
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(developers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch developers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const developer = await (db as any).developer.create({
      data: {
        name: body.name,
        role: body.role,
        about: body.about,
        image: body.image,
        portfolio: body.portfolio,
        resume: body.resume,
        skills: body.skills || [],
        projects: body.projects || [],
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(developer);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create developer" }, { status: 500 });
  }
}
