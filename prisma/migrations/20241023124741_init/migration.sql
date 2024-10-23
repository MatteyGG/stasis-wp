-- AlterTable
ALTER TABLE "Wiki" ALTER COLUMN "scr" SET DEFAULT 'placeholder.png',
ALTER COLUMN "alt" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL;
