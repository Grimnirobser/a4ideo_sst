/*
  Warnings:

  - You are about to drop the column `tagId` on the `Community` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[problemsetId]` on the table `Community` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `problemsetId` to the `Community` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Community" DROP CONSTRAINT "Community_tagId_fkey";

-- AlterTable
ALTER TABLE "Community" DROP COLUMN "tagId",
ADD COLUMN     "problemsetId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Problemset" ADD COLUMN     "communityId" INTEGER NOT NULL DEFAULT -1;

-- CreateIndex
CREATE UNIQUE INDEX "Community_problemsetId_key" ON "Community"("problemsetId");

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_problemsetId_fkey" FOREIGN KEY ("problemsetId") REFERENCES "Problemset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
