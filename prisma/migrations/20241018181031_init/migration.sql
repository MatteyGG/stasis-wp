-- CreateTable
CREATE TABLE "Wiki" (
    "pageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "md" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wiki_pkey" PRIMARY KEY ("pageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wiki_pageId_key" ON "Wiki"("pageId");
