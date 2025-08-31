-- DropForeignKey
ALTER TABLE "WikiView" DROP CONSTRAINT "WikiView_userId_fkey";

-- AlterTable
ALTER TABLE "WikiView" ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'Аноним';

-- CreateIndex
CREATE INDEX "WikiView_userId_idx" ON "WikiView"("userId");
