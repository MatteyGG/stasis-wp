/*
  Warnings:

  - You are about to drop the `imagesLibary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "imagesLibary";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
