import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { paOutcomeSubmitSchema } from '@/src/lib/validations/paOutcome';

// Simple in-memory rate limiter: max 10 submissions per user per hour
const submissionCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(userId: string): boolean {
    const now = Date.now();
    const entry = submissionCounts.get(userId);
    if (!entry || now > entry.resetAt) {
        submissionCounts.set(userId, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }
    if (entry.count >= RATE_LIMIT) return true;
    entry.count++;
    return false;
}

// POST - Submit PA Outcome report

export async function POST(request: NextRequest) {

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isRateLimited(session.user.id)) {
        return NextResponse.json({ error: 'Too many submissions. Please wait before submitting again.' }, { status: 429 });
    }

    try {
        const body = await request.json();
        const validated = paOutcomeSubmitSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({ error: 'Invalid input', details: validated.error.issues }, { status: 400 });
        }

        const { medicationId, insuranceId, indication, requestType, outcome, notes } = validated.data;

        const paOutcome = await prisma.pAOutcomeReport.create({
            data: {
                userId: session.user.id,
                medicationId,
                insuranceId,
                indication,
                requestType,
                outcome,
                notes: notes || null,
            },
        });

        return NextResponse.json(paOutcome, { status: 201 });
    } catch (error) {
        console.error('Error submitting PA outcome:', error);
        return NextResponse.json({ error: 'Failed to Submit' }, { status: 500 });
    }

}

// GET - Retrieve PA Outcome reports for the authenticated user

export async function GET(request: NextRequest) {

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const genericName = searchParams.get('genericName');
    const insuranceId = searchParams.get('insuranceId');

    if (!genericName || !insuranceId) {
        return NextResponse.json({ error: 'genericName and insuranceId are required' }, { status: 400 });
    }

    try {
        const outcomes = await prisma.pAOutcomeReport.findMany({
            where: {
                medication: { genericName },
                insuranceId,
            },
            include: {
                medication: { select: { genericName: true, brandName: true} },
                insurance: { select: { payerName: true } },
                
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });

        return NextResponse.json(outcomes, { status: 200 });
    } catch (error) {
        console.error('Error retrieving PA outcomes:', error);
        return NextResponse.json({ error: 'Failed to Retrieve' }, { status: 500 });

            }
    }
