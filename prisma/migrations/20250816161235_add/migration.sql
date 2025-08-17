/*
  Warnings:

  - You are about to drop the `serverUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "C4" ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "players" DROP NOT NULL;

-- DropTable
DROP TABLE "serverUser";

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL,
    "ally" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "TownHall" INTEGER NOT NULL,
    "power" INTEGER NOT NULL,
    "kill" INTEGER NOT NULL,
    "die" INTEGER NOT NULL,
    "kd" DOUBLE PRECISION NOT NULL,
    "onSite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSnapshot" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "c4Id" INTEGER NOT NULL,
    "ally" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "TownHall" INTEGER NOT NULL,
    "power" INTEGER NOT NULL,
    "kill" INTEGER NOT NULL,
    "die" INTEGER NOT NULL,
    "kd" DOUBLE PRECISION NOT NULL,
    "snapshotAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- AddForeignKey
ALTER TABLE "PlayerSnapshot" ADD CONSTRAINT "PlayerSnapshot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSnapshot" ADD CONSTRAINT "PlayerSnapshot_c4Id_fkey" FOREIGN KEY ("c4Id") REFERENCES "C4"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
