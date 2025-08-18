/*
  Warnings:

  - The primary key for the `C4` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `link` on the `C4` table. All the data in the column will be lost.
  - You are about to drop the column `players` on the `C4` table. All the data in the column will be lost.
  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PlayerSnapshot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ally` on the `PlayerSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `PlayerSnapshot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[warpathId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `warpathId` to the `PlayerSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlayerSnapshot" DROP CONSTRAINT "PlayerSnapshot_c4Id_fkey";

-- AlterTable
ALTER TABLE "C4" DROP CONSTRAINT "C4_pkey",
DROP COLUMN "link",
DROP COLUMN "players",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "C4_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "C4_id_seq";

-- AlterTable
ALTER TABLE "Player" DROP CONSTRAINT "Player_pkey",
ADD COLUMN     "warpathId" INTEGER,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "ally" DROP NOT NULL,
ADD CONSTRAINT "Player_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PlayerSnapshot" DROP CONSTRAINT "PlayerSnapshot_pkey",
DROP COLUMN "ally",
DROP COLUMN "username",
ADD COLUMN     "warpathId" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "playerId" DROP NOT NULL,
ALTER COLUMN "playerId" SET DATA TYPE TEXT,
ALTER COLUMN "c4Id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PlayerSnapshot_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PlayerSnapshot_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Player_warpathId_key" ON "Player"("warpathId");

-- CreateIndex
CREATE INDEX "PlayerSnapshot_warpathId_idx" ON "PlayerSnapshot"("warpathId");

-- CreateIndex
CREATE INDEX "PlayerSnapshot_playerId_idx" ON "PlayerSnapshot"("playerId");

-- AddForeignKey
ALTER TABLE "PlayerSnapshot" ADD CONSTRAINT "PlayerSnapshot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSnapshot" ADD CONSTRAINT "PlayerSnapshot_c4Id_fkey" FOREIGN KEY ("c4Id") REFERENCES "C4"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
