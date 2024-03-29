/*
  Warnings:

  - You are about to drop the column `imageSrc` on the `Community` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Community" DROP COLUMN "imageSrc",
ADD COLUMN     "imageSrcs" TEXT[];
