import { db } from "@/lib/prisma"
import { NextResponse } from "next/server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const plans = await db.pricingPlan.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(plans)
  } catch (error) {
    console.error("GET pricing error:", error)
    return NextResponse.json({ error: "Failed to fetch plans", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json()
    const { name, priceMonthly, priceYearly, description, features, isPopular, ctaText } = body

    const plan = await db.pricingPlan.create({
      data: {
        name,
        priceMonthly,
        priceYearly,
        description,
        features: Array.isArray(features) ? features : features.split(',').map((f: string) => f.trim()),
        isPopular: !!isPopular,
        ctaText: ctaText || "Get Started"
      }
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error("Create plan error:", error)
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 })
  }
}
