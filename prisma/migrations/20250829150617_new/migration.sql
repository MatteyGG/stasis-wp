/*
  Warnings:

  - You are about to drop the column `army` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nation` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "army",
DROP COLUMN "nation";

-- CreateTable
CREATE TABLE "UserTechSlot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "nation" TEXT,
    "unit" TEXT,

    CONSTRAINT "UserTechSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTechSlot_userId_type_slotIndex_key" ON "UserTechSlot"("userId", "type", "slotIndex");

-- AddForeignKey
ALTER TABLE "UserTechSlot" ADD CONSTRAINT "UserTechSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
