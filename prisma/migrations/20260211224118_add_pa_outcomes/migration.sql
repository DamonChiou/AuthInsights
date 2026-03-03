-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "genericName" TEXT NOT NULL,
    "brandName" TEXT,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsurancePlan" (
    "id" TEXT NOT NULL,
    "payerName" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsurancePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuidelineRule" (
    "id" TEXT NOT NULL,
    "drugClassName" TEXT NOT NULL,
    "insuranceId" TEXT NOT NULL,
    "requestType" TEXT,
    "baseRequirements" JSONB NOT NULL,
    "conditionalRules" JSONB NOT NULL,
    "formLinks" JSONB NOT NULL,
    "portalUrl" TEXT,
    "portalNotes" TEXT,
    "commonDenials" JSONB,
    "proTips" TEXT,
    "expectedDays" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuidelineRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriorAuthRequest" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "insuranceId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientDOB" TIMESTAMP(3) NOT NULL,
    "patientMemberId" TEXT,
    "userAnswers" JSONB,
    "checklistSteps" JSONB NOT NULL,
    "formLinks" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "decisionDate" TIMESTAMP(3),
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriorAuthRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PAOutcomeReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "insuranceId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "denialReason" TEXT,
    "preferredBiosimilarId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PAOutcomeReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Medication_genericName_idx" ON "Medication"("genericName");

-- CreateIndex
CREATE INDEX "Medication_category_idx" ON "Medication"("category");

-- CreateIndex
CREATE INDEX "InsurancePlan_payerName_idx" ON "InsurancePlan"("payerName");

-- CreateIndex
CREATE INDEX "GuidelineRule_drugClassName_idx" ON "GuidelineRule"("drugClassName");

-- CreateIndex
CREATE INDEX "GuidelineRule_insuranceId_idx" ON "GuidelineRule"("insuranceId");

-- CreateIndex
CREATE UNIQUE INDEX "GuidelineRule_drugClassName_insuranceId_requestType_key" ON "GuidelineRule"("drugClassName", "insuranceId", "requestType");

-- CreateIndex
CREATE UNIQUE INDEX "PriorAuthRequest_referenceNumber_key" ON "PriorAuthRequest"("referenceNumber");

-- CreateIndex
CREATE INDEX "PriorAuthRequest_userId_idx" ON "PriorAuthRequest"("userId");

-- CreateIndex
CREATE INDEX "PriorAuthRequest_status_idx" ON "PriorAuthRequest"("status");

-- CreateIndex
CREATE INDEX "PriorAuthRequest_referenceNumber_idx" ON "PriorAuthRequest"("referenceNumber");

-- CreateIndex
CREATE INDEX "PriorAuthRequest_createdAt_idx" ON "PriorAuthRequest"("createdAt");

-- CreateIndex
CREATE INDEX "PAOutcomeReport_medicationId_insuranceId_idx" ON "PAOutcomeReport"("medicationId", "insuranceId");

-- CreateIndex
CREATE INDEX "PAOutcomeReport_insuranceId_idx" ON "PAOutcomeReport"("insuranceId");

-- AddForeignKey
ALTER TABLE "GuidelineRule" ADD CONSTRAINT "GuidelineRule_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "InsurancePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorAuthRequest" ADD CONSTRAINT "PriorAuthRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorAuthRequest" ADD CONSTRAINT "PriorAuthRequest_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorAuthRequest" ADD CONSTRAINT "PriorAuthRequest_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "InsurancePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAOutcomeReport" ADD CONSTRAINT "PAOutcomeReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAOutcomeReport" ADD CONSTRAINT "PAOutcomeReport_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAOutcomeReport" ADD CONSTRAINT "PAOutcomeReport_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "InsurancePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAOutcomeReport" ADD CONSTRAINT "PAOutcomeReport_preferredBiosimilarId_fkey" FOREIGN KEY ("preferredBiosimilarId") REFERENCES "Medication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
