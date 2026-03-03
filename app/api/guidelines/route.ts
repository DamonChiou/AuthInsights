import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { guidelinesSchema } from "@/src/lib/validations/guidelines";
import { auth } from "@/src/auth";

export async function POST(request: NextRequest) {
    //check first if user is authenticated
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await request.json();
        const validatedData = guidelinesSchema.parse(body);

        const guideline = await prisma.guidelineRule.create({
            data: {
                drugClassName: validatedData.medicationId,
                insuranceId: validatedData.insuranceId,
                requestType: validatedData.requestType,
                baseRequirements: validatedData.baseRequirements,
                conditionalRules: validatedData.conditionalRules ?? [],
                formLinks: validatedData.formLinks ?? [],
                portalUrl: validatedData.portalUrl || null,
                portalNotes: validatedData.additionalInfo || null,
            }
        });
        return NextResponse.json(guideline, { status: 201 });
    
    } catch (error) {
        console.error("Error creating guideline:", error);
        return NextResponse.json({ error: "Failed to create guideline" }, { status: 500 });

    }
}

export async function GET() {
    try {
        const guidelines = await prisma.guidelineRule.findMany({
            include: {
                medication: { select: { genericName: true } },
                insurance: { select: { payerName: true } },
            },
            orderBy: { createdAt: "desc" },
        });

    

        return NextResponse.json(guidelines, { status: 200 });
    } catch (error) {
        console.error("Error fetching guidelines:", error);
        return NextResponse.json({ error: "Failed to fetch guidelines" }, { status: 500 });
    };
}

