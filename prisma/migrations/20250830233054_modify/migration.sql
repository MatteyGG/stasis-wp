/*
  Warnings:

  - The primary key for the `Wiki` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `Wiki` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `Wiki` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wiki" DROP CONSTRAINT "Wiki_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "scr" DROP NOT NULL,
ALTER COLUMN "scr" DROP DEFAULT,
ALTER COLUMN "alt" DROP DEFAULT,
ALTER COLUMN "md" DROP NOT NULL,
ADD CONSTRAINT "Wiki_pkey" PRIMARY KEY ("id");
