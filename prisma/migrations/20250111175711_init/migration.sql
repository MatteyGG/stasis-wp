/*
  Warnings:

  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Member";

-- CreateTable
CREATE TABLE "serverUser" (
    "id" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,
    "TownHall" INTEGER NOT NULL,
    "power" TEXT NOT NULL,
    "kill" INTEGER NOT NULL,
    "die" INTEGER NOT NULL,
    "kd" TEXT NOT NULL,
    "onSite" BOOLEAN NOT NULL,

    CONSTRAINT "serverUser_pkey" PRIMARY KEY ("id")
);
