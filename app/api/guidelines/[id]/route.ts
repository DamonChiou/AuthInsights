import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.guidelineRule.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting guideline:", error);
    return NextResponse.json(
      { error: "Failed to delete guideline" },
      { status: 500 }
    );
  }
}