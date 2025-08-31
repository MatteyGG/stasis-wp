-- CreateTable
CREATE TABLE "WikiView" (
    "id" TEXT NOT NULL,
    "wikiPageId" TEXT NOT NULL,
    "userId" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WikiView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WikiView_wikiPageId_idx" ON "WikiView"("wikiPageId");

-- CreateIndex
CREATE INDEX "WikiView_viewedAt_idx" ON "WikiView"("viewedAt");

-- AddForeignKey
ALTER TABLE "WikiView" ADD CONSTRAINT "WikiView_wikiPageId_fkey" FOREIGN KEY ("wikiPageId") REFERENCES "Wiki"("pageId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiView" ADD CONSTRAINT "WikiView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
