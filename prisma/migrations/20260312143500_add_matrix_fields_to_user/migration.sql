-- AlterTable
ALTER TABLE "User"
ADD COLUMN "matrixMxid" TEXT,
ADD COLUMN "matrixDisplayName" TEXT,
ADD COLUMN "matrixLinkedAt" TIMESTAMP(3),
ADD COLUMN "matrixProvisionStatus" TEXT DEFAULT 'not_linked';

-- CreateIndex
CREATE UNIQUE INDEX "User_matrixMxid_key" ON "User"("matrixMxid");
