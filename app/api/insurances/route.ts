import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
    try {
        const insurances = await prisma.insurancePlan.findMany({
            select: { id: true, payerName: true },
            orderBy: { payerName: "asc" },
        });
        const formatted = insurances.map(i => ({ id: i.id, name: i.payerName }));
        return NextResponse.json(formatted, { status: 200 });
    } catch (error) {
        console.error("Error fetching insurances:", error);
        return NextResponse.json({ error: "Failed to fetch insurances" }, { status: 500 });
    }
}