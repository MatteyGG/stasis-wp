-- CreateTable
CREATE TABLE "C4" (
    "id" SERIAL NOT NULL,
    "map" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "players" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "C4_pkey" PRIMARY KEY ("id")
);
