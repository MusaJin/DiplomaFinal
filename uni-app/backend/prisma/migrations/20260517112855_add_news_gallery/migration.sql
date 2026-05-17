-- AlterTable
ALTER TABLE "news" ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];
