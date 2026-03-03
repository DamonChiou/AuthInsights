import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
    try {
        const medications = await prisma.medication.findMany({
            select: { id: true, genericName: true, brandName: true },
            orderBy: { genericName: "asc" },
        });
        return NextResponse.json(medications, { status: 200 });
    } catch (error) {
        console.error("Error fetching medications:", error);
        return NextResponse.json({ error: "Failed to fetch medications" }, { status: 500 });
    };
}