-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "gameID" TEXT NOT NULL,
    "username" TEXT DEFAULT '',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "password" CHAR(60) NOT NULL DEFAULT 'default_Ann_password_value',
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "tgref" TEXT DEFAULT '',
    "role" TEXT DEFAULT 'user',
    "rank" TEXT DEFAULT 'R1',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTechSlot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "nation" TEXT,
    "unit" TEXT,

    CONSTRAINT "UserTechSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wikicategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wikicategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wiki" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "title" TEXT,
    "scr" TEXT,
    "alt" TEXT,
    "category" TEXT,
    "short" TEXT,
    "md" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "autor" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],

    CONSTRAINT "Wiki_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiView" (
    "id" TEXT NOT NULL,
    "wikiPageId" TEXT NOT NULL,
    "userId" TEXT,
    "username" TEXT NOT NULL DEFAULT 'Аноним',
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WikiView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSnapshot" (
    "id" TEXT NOT NULL,
    "warpathId" INTEGER NOT NULL,
    "username" TEXT NOT NULL DEFAULT 'NoNick',
    "playerId" TEXT,
    "c4Id" TEXT NOT NULL,
    "power" INTEGER NOT NULL,
    "kill" INTEGER NOT NULL,
    "die" INTEGER NOT NULL,
    "kd" DOUBLE PRECISION NOT NULL,
    "snapshotAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "C4" (
    "id" TEXT NOT NULL,
    "map" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT DEFAULT 'In process',
    "avgPowerGain" DOUBLE PRECISION,
    "avgKillGain" DOUBLE PRECISION,
    "avgDieGain" DOUBLE PRECISION,
    "avgKdGain" DOUBLE PRECISION,
    "totalPlayers" INTEGER,

    CONSTRAINT "C4_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "C4Statistic" (
    "id" TEXT NOT NULL,
    "c4Id" TEXT NOT NULL,
    "playerId" TEXT,
    "warpathId" INTEGER NOT NULL,
    "username" TEXT NOT NULL DEFAULT 'NoNick',
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

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "warpathId" INTEGER,
    "serverId" INTEGER,
    "username" TEXT NOT NULL,
    "ally" TEXT,
    "power" INTEGER NOT NULL,
    "kill" INTEGER NOT NULL,
    "die" INTEGER NOT NULL,
    "kd" DOUBLE PRECISION NOT NULL,
    "resourceCollection" BIGINT,
    "techPower" INTEGER,
    "airPower" INTEGER,
    "navyPower" INTEGER,
    "groundPower" INTEGER,
    "onSite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promocode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "until" TIMESTAMP(3),

    CONSTRAINT "Promocode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "power" BIGINT NOT NULL,
    "leader" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_gameID_key" ON "User"("gameID");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserTechSlot_userId_type_slotIndex_key" ON "UserTechSlot"("userId", "type", "slotIndex");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Wikicategory_name_key" ON "Wikicategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Wiki_pageId_key" ON "Wiki"("pageId");

-- CreateIndex
CREATE INDEX "WikiView_wikiPageId_idx" ON "WikiView"("wikiPageId");

-- CreateIndex
CREATE INDEX "WikiView_viewedAt_idx" ON "WikiView"("viewedAt");

-- CreateIndex
CREATE INDEX "WikiView_userId_idx" ON "WikiView"("userId");

-- CreateIndex
CREATE INDEX "C4_startedAt_idx" ON "C4"("startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Player_warpathId_key" ON "Player"("warpathId");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gameID_fkey" FOREIGN KEY ("gameID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTechSlot" ADD CONSTRAINT "UserTechSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiView" ADD CONSTRAINT "WikiView_wikiPageId_fkey" FOREIGN KEY ("wikiPageId") REFERENCES "Wiki"("pageId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSnapshot" ADD CONSTRAINT "PlayerSnapshot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSnapshot" ADD CONSTRAINT "PlayerSnapshot_c4Id_fkey" FOREIGN KEY ("c4Id") REFERENCES "C4"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "C4Statistic" ADD CONSTRAINT "C4Statistic_c4Id_fkey" FOREIGN KEY ("c4Id") REFERENCES "C4"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "C4Statistic" ADD CONSTRAINT "C4Statistic_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

