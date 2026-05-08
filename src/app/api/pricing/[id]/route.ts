import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ fix

    await db.pricingPlan.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Plan deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    );
  }
}

// PATCH
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ fix
    const body = await req.json();

    const plan = await db.pricingPlan.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
}
