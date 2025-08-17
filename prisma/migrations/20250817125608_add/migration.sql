-- DropForeignKey
ALTER TABLE "PlayerSnapshot" DROP CONSTRAINT "PlayerSnapshot_playerId_fkey";

-- AlterTable
ALTER TABLE "C4" ALTER COLUMN "status" SET DEFAULT 'active';
