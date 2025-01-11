/*
  Warnings:

  - You are about to drop the column `nickname` on the `serverUser` table. All the data in the column will be lost.
  - Added the required column `username` to the `serverUser` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `power` on the `serverUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `kd` on the `serverUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "serverUser" DROP COLUMN "nickname",
ADD COLUMN     "username" TEXT NOT NULL,
DROP COLUMN "power",
ADD COLUMN     "power" INTEGER NOT NULL,
DROP COLUMN "kd",
ADD COLUMN     "kd" DOUBLE PRECISION NOT NULL;
