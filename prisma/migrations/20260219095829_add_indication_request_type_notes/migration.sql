/*
  Warnings:

  - You are about to drop the column `denialReason` on the `PAOutcomeReport` table. All the data in the column will be lost.
  - You are about to drop the column `preferredBiosimilarId` on the `PAOutcomeReport` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PAOutcomeReport" DROP CONSTRAINT "PAOutcomeReport_preferredBiosimilarId_fkey";

-- AlterTable
ALTER TABLE "PAOutcomeReport" DROP COLUMN "denialReason",
DROP COLUMN "preferredBiosimilarId",
ADD COLUMN     "indication" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "requestType" TEXT;
