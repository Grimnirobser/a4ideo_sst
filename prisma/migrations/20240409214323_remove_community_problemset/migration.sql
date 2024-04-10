/*
  Warnings:

  - You are about to drop the column `problemsetId` on the `Community` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Community_problemsetId_key";

-- AlterTable
ALTER TABLE "Community" DROP COLUMN "problemsetId";
