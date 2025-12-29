-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
