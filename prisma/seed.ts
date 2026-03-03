import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── Note pools ────────────────────────────────────────────────────────────────

const APPROVED_NOTES: (string | null)[] = [
    "Step therapy completed — MTX and leflunomide failure documented. Approved in 5 business days.",
    "Submitted DAS28 score over 5.1 along with rheumatologist letter. Clean approval.",
    "Preferred biosimilar on the formulary. No step therapy required, approved same week.",
    "Previous TNFi failure clearly documented in the chart. Insurance approved without pushback.",
    "Included joint count, CRP, and ESR labs. Approval came back in 3 days.",
    "CDAI score of 32 submitted with the PA. Straightforward approval.",
    "Had all documentation ready — DMARD failure records, diagnosis letters, labs. Smooth process.",
    "Peer-to-peer review with the medical director resolved the initial hold. Approved shortly after.",
    "Letter of medical necessity from the rheumatologist was sufficient. Approved on first try.",
    "Insurance preferred this biosimilar. Went through without any additional documentation requests.",
    "X-ray showing joint progression submitted alongside clinical notes. Approved in one week.",
    "Resubmitted with contraindication letter for methotrexate. Approved on second attempt.",
    "Had 6 months of MTX failure documented. Approved without needing a peer-to-peer.",
    "Biologic-naive patient with high disease activity. Insurance approved given CDAI and labs.",
    "Two prior DMARD failures well-documented. Approval was quick once we included the summary letter.",
    "Attached office notes from the last three visits. Approved without additional requests.",
    "Required failure of a preferred TNFi first — had that documented. Approval came through.",
    "Insurance accepted the electronic PA submission within 4 business days.",
    "Included imaging showing erosive disease. That seemed to be the deciding factor.",
    null,
    null,
    null,
];

const DENIED_NOTES: (string | null)[] = [
    "Denied — insufficient DMARD trial documentation. Plan requires two csDMARD failures.",
    "Denied for inadequate step therapy. Need to document failure of a preferred biosimilar first.",
    "Denied — requested brand name when biosimilar step therapy is required under this plan.",
    "Denied. Plan requires 6-month DMARD trial; only had 3 months documented at time of submission.",
    "Denied due to diagnosis coding mismatch. Resubmitting with corrected ICD-10.",
    "Denied — missing specific lab values required by this payer. Adding CRP and ESR to resubmission.",
    "Denied on initial review. Submitting peer-to-peer request with the medical director.",
    "Denied — plan requires failure of a different TNFi before this one. Adjusting treatment plan.",
    "Step therapy denial. Filing appeal with a letter of contraindication for the required alternative.",
    "Denied. Missing prior treatment history in submission. Gathering records to resubmit.",
    "Denied — no documentation of active disease at time of submission. Need updated labs.",
    "Denied. Plan requires specialist letter; only had a PA order without supporting notes.",
    "Denied on initial. Appealing with peer-to-peer and additional disease activity documentation.",
    "Denied — formulary exception required for this biosimilar under the patient's plan.",
    null,
    null,
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateInPast(maxDaysBack: number): Date {
    const ms = Math.random() * maxDaysBack * 24 * 60 * 60 * 1000;
    return new Date(Date.now() - ms);
}

const INDICATIONS = [
    "Rheumatoid Arthritis (RA)",
    "Psoriatic Arthritis (PsA)",
    "Ankylosing Spondylitis / Axial SpA (AS)",
    "Systemic Lupus Erythematosus (SLE)",
    "Giant Cell Arteritis (GCA)",
    "ANCA-Associated Vasculitis",
    "Juvenile Idiopathic Arthritis (JIA)",
    "Other",
];

function generateOutcomes(
    userId: string,
    medId: string,
    insuranceId: string,
    count: number,
    approvalRate: number,
) {
    const rows = [];
    const initialCount = Math.round(count * 0.72);
    const appealCount = count - initialCount;
    const appealApprovalRate = Math.min(0.75, approvalRate + 0.08); // appeals slightly better after initial denial

    for (let i = 0; i < initialCount; i++) {
        const approved = Math.random() < approvalRate;
        rows.push({
            userId,
            medicationId: medId,
            insuranceId,
            indication: pick(INDICATIONS),
            requestType: "initial",
            outcome: approved ? "approved" : "denied",
            notes: approved ? pick(APPROVED_NOTES) : pick(DENIED_NOTES),
            submittedAt: randomDateInPast(365),
        });
    }

    for (let i = 0; i < appealCount; i++) {
        const approved = Math.random() < appealApprovalRate;
        rows.push({
            userId,
            medicationId: medId,
            insuranceId,
            indication: pick(INDICATIONS),
            requestType: "appeal",
            outcome: approved ? "approved" : "denied",
            notes: approved ? pick(APPROVED_NOTES) : pick(DENIED_NOTES),
            submittedAt: randomDateInPast(365),
        });
    }

    return rows;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    console.log("Seeding database...");

    // Delete in FK-safe order (child tables first)
    await prisma.pAOutcomeReport.deleteMany();
    await prisma.priorAuthRequest.deleteMany();
    await prisma.guidelineRule.deleteMany();
    await prisma.medication.deleteMany();
    await prisma.insurancePlan.deleteMany();
    await prisma.user.deleteMany();
    console.log("Cleared existing records.");

    // ── Seed user (outcomes require a userId FK) ──────────────────────────────
    const passwordHash = await bcrypt.hash("SeedUser123!", 10);
    const seedUser = await prisma.user.create({
        data: {
            email: "seed@authinsights.com",
            name: "AuthInsights Seed",
            passwordHash,
        },
    });
    console.log("Created seed user.");

    // ── Medications ───────────────────────────────────────────────────────────
    await prisma.medication.createMany({
        data: [
            // adalimumab (TNF inhibitor)
            { genericName: "adalimumab", brandName: "Humira",   category: "BIOLOGIC" },
            { genericName: "adalimumab", brandName: "Hadlima",  category: "BIOLOGIC" },
            { genericName: "adalimumab", brandName: "Cyltezo",  category: "BIOLOGIC" },
            { genericName: "adalimumab", brandName: "Hyrimoz",  category: "BIOLOGIC" },
            { genericName: "adalimumab", brandName: "Yusimry",  category: "BIOLOGIC" },
            { genericName: "adalimumab", brandName: "Abrilada", category: "BIOLOGIC" },
            { genericName: "adalimumab", brandName: "Hulio",    category: "BIOLOGIC" },
            { genericName: "adalimumab", brandName: "Simlandi", category: "BIOLOGIC" },
            // etanercept (TNF inhibitor)
            { genericName: "etanercept", brandName: "Enbrel",   category: "BIOLOGIC" },
            { genericName: "etanercept", brandName: "Eticovo",  category: "BIOLOGIC" },
            { genericName: "etanercept", brandName: "Erelzi",   category: "BIOLOGIC" },
            // infliximab (TNF inhibitor, IV)
            { genericName: "infliximab", brandName: "Remicade",  category: "BIOLOGIC" },
            { genericName: "infliximab", brandName: "Inflectra", category: "BIOLOGIC" },
            { genericName: "infliximab", brandName: "Renflexis", category: "BIOLOGIC" },
            { genericName: "infliximab", brandName: "Avsola",    category: "BIOLOGIC" },
            // tocilizumab (IL-6 inhibitor)
            { genericName: "tocilizumab", brandName: "Actemra",   category: "BIOLOGIC" },
            { genericName: "tocilizumab", brandName: "Tyenne",    category: "BIOLOGIC" },
            { genericName: "tocilizumab", brandName: "Tofidence", category: "BIOLOGIC" },
            // rituximab (CD20 inhibitor)
            { genericName: "rituximab", brandName: "Rituxan",  category: "BIOLOGIC" },
            { genericName: "rituximab", brandName: "Truxima",  category: "BIOLOGIC" },
            { genericName: "rituximab", brandName: "Ruxience", category: "BIOLOGIC" },
            // JAK inhibitors
            { genericName: "upadacitinib", brandName: "Rinvoq",  category: "JAK_INHIBITOR" },
            { genericName: "tofacitinib",  brandName: "Xeljanz", category: "JAK_INHIBITOR" },
            // ustekinumab (IL-12/23)
            { genericName: "ustekinumab", brandName: "Stelara",  category: "BIOLOGIC" },
            { genericName: "ustekinumab", brandName: "Wezlana",  category: "BIOLOGIC" },
        ],
    });
    console.log("Created medications.");

    // ── Insurance plans ───────────────────────────────────────────────────────
    await prisma.insurancePlan.createMany({
        data: [
            { payerName: "UnitedHealthcare Commercial", planType: "COMMERCIAL" },
            { payerName: "Aetna Commercial",            planType: "COMMERCIAL" },
            { payerName: "Cigna Commercial",            planType: "COMMERCIAL" },
            { payerName: "Anthem BCBS",                 planType: "COMMERCIAL" },
            { payerName: "Medicare Part D",             planType: "MEDICARE"   },
        ],
    });
    console.log("Created insurance plans.");

    // ── Fetch IDs ─────────────────────────────────────────────────────────────
    const meds = await prisma.medication.findMany();
    const plans = await prisma.insurancePlan.findMany();

    const medId = (brand: string) => meds.find(m => m.brandName === brand)!.id;
    const insId = (name: string)  => plans.find(p => p.payerName === name)!.id;

    const UHC     = insId("UnitedHealthcare Commercial");
    const AETNA   = insId("Aetna Commercial");
    const CIGNA   = insId("Cigna Commercial");
    const ANTHEM  = insId("Anthem BCBS");
    const MEDICARE = insId("Medicare Part D");

    const uid = seedUser.id;

    // ── Outcome coverage matrix ───────────────────────────────────────────────
    // Each entry: [brandName, insuranceId, count, approvalRate]
    // Realistic patterns:
    //   - Preferred biosimilars approve faster (~70-75%)
    //   - Brand Humira gets denied more (step therapy required, ~45%)
    //   - JAK inhibitors have strict step therapy (~52-58%)
    //   - Medicare is slightly more lenient on preferred biosimilars
    const matrix: [string, string, number, number][] = [

        // ── adalimumab ─────────────────────────────────────────────────────
        // Humira (brand) — step therapy required everywhere
        ["Humira",   UHC,     5, 0.42],
        ["Humira",   AETNA,   4, 0.45],
        ["Humira",   CIGNA,   3, 0.40],
        ["Humira",   ANTHEM,  3, 0.38],

        // Hadlima — UHC preferred, high approval
        ["Hadlima",  UHC,     7, 0.74],
        ["Hadlima",  AETNA,   5, 0.66],
        ["Hadlima",  MEDICARE,4, 0.72],

        // Cyltezo
        ["Cyltezo",  UHC,     5, 0.68],
        ["Cyltezo",  AETNA,   5, 0.65],
        ["Cyltezo",  CIGNA,   4, 0.62],

        // Hyrimoz — Cigna preferred
        ["Hyrimoz",  CIGNA,   6, 0.72],
        ["Hyrimoz",  UHC,     4, 0.66],
        ["Hyrimoz",  ANTHEM,  4, 0.60],

        // Yusimry
        ["Yusimry",  AETNA,   4, 0.63],
        ["Yusimry",  MEDICARE,4, 0.68],

        // Hulio, Abrilada, Simlandi — fewer reports
        ["Hulio",    UHC,     3, 0.60],
        ["Abrilada", AETNA,   3, 0.58],
        ["Simlandi", CIGNA,   3, 0.55],

        // ── etanercept ─────────────────────────────────────────────────────
        ["Enbrel",   UHC,     5, 0.58],
        ["Enbrel",   AETNA,   5, 0.62],
        ["Enbrel",   ANTHEM,  4, 0.55],
        ["Eticovo",  UHC,     5, 0.70],
        ["Eticovo",  CIGNA,   4, 0.68],
        ["Erelzi",   AETNA,   4, 0.66],
        ["Erelzi",   MEDICARE,3, 0.72],

        // ── infliximab ─────────────────────────────────────────────────────
        ["Remicade",  UHC,    4, 0.52],
        ["Remicade",  ANTHEM, 3, 0.48],
        ["Inflectra", UHC,    5, 0.68],
        ["Inflectra", AETNA,  4, 0.65],
        ["Renflexis", CIGNA,  4, 0.66],
        ["Avsola",    MEDICARE,3, 0.70],

        // ── tocilizumab ────────────────────────────────────────────────────
        ["Actemra",   UHC,    5, 0.65],
        ["Actemra",   AETNA,  4, 0.63],
        ["Tyenne",    UHC,    4, 0.68],
        ["Tyenne",    CIGNA,  3, 0.64],
        ["Tofidence", ANTHEM, 3, 0.60],

        // ── rituximab ──────────────────────────────────────────────────────
        ["Rituxan",  UHC,    4, 0.62],
        ["Rituxan",  AETNA,  3, 0.65],
        ["Truxima",  UHC,    4, 0.70],
        ["Ruxience", CIGNA,  3, 0.68],

        // ── JAK inhibitors (strict step therapy) ───────────────────────────
        ["Rinvoq",  UHC,     5, 0.54],
        ["Rinvoq",  AETNA,   4, 0.52],
        ["Rinvoq",  CIGNA,   3, 0.56],
        ["Xeljanz", UHC,     4, 0.50],
        ["Xeljanz", ANTHEM,  3, 0.52],
        ["Xeljanz", MEDICARE,3, 0.60],

        // ── ustekinumab ────────────────────────────────────────────────────
        ["Stelara",  UHC,    4, 0.60],
        ["Stelara",  AETNA,  3, 0.62],
        ["Wezlana",  CIGNA,  3, 0.65],
        ["Wezlana",  MEDICARE,3, 0.68],
    ];

    // ── Generate and insert all outcomes ─────────────────────────────────────
    let totalInserted = 0;
    for (const [brand, insId, count, rate] of matrix) {
        const mid = medId(brand);
        const rows = generateOutcomes(uid, mid, insId, count, rate);
        await prisma.pAOutcomeReport.createMany({ data: rows });
        totalInserted += rows.length;
    }

    console.log(`Created ${totalInserted} PA outcome reports.`);
    console.log("Seed completed!");
}

main()
    .catch((e) => {
        console.error("Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
