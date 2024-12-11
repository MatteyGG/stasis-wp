-- CreateTable
CREATE TABLE "Guild" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "power" BIGINT NOT NULL,
    "leader" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,
    "TownHall" INTEGER NOT NULL,
    "power" TEXT NOT NULL,
    "kill" INTEGER NOT NULL,
    "die" INTEGER NOT NULL,
    "kills" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);
