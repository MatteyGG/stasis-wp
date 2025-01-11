/*
  Warnings:

  - Added the required column `ally` to the `serverUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "serverUser" ADD COLUMN     "ally" TEXT NOT NULL;
