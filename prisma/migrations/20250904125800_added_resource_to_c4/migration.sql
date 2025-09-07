-- AlterTable
ALTER TABLE "C4" ADD COLUMN     "avgResourceGain" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "C4Statistic" ADD COLUMN     "resourceCollectionGain" BIGINT,
ADD COLUMN     "startResourceCollection" BIGINT;

-- AlterTable
ALTER TABLE "PlayerSnapshot" ADD COLUMN     "resourceCollection" BIGINT;
