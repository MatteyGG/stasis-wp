/*
  Warnings:

  - You are about to drop the column `TownHall` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `TownHall` on the `PlayerSnapshot` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PlayerSnapshot_playerId_idx";

-- DropIndex
DROP INDEX "PlayerSnapshot_warpathId_idx";

-- AlterTable
ALTER TABLE "C4" ADD COLUMN     "avgDieGain" DOUBLE PRECISION,
ADD COLUMN     "avgKdGain" DOUBLE PRECISION,
ADD COLUMN     "avgKillGain" DOUBLE PRECISION,
ADD COLUMN     "avgPowerGain" DOUBLE PRECISION,
ADD COLUMN     "totalPlayers" INTEGER;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "TownHall";

-- AlterTable
ALTER TABLE "PlayerSnapshot" DROP COLUMN "TownHall";

-- CreateTable
CREATE TABLE "C4Statistic" (
    "id" TEXT NOT NULL,
    "c4Id" TEXT NOT NULL,
    "playerId" TEXT,
    "warpathId" INTEGER NOT NULL,
    "startPower" INTEGER NOT NULL,
    "startKill" INTEGER NOT NULL,
    "startDie" INTEGER NOT NULL,
    "startKd" DOUBLE PRECISION NOT NULL,
    "powerGain" INTEGER,
    "killGain" INTEGER,
    "dieGain" INTEGER,
    "kdGain" DOUBLE PRECISION,

    CONSTRAINT "C4Statistic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "C4_startedAt_idx" ON "C4"("startedAt");

-- AddForeignKey
ALTER TABLE "C4Statistic" ADD CONSTRAINT "C4Statistic_c4Id_fkey" FOREIGN KEY ("c4Id") REFERENCES "C4"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "C4Statistic" ADD CONSTRAINT "C4Statistic_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
