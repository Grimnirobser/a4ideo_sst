/*
  Warnings:

  - You are about to drop the column `communityId` on the `Problemset` table. All the data in the column will be lost.
  - Added the required column `entranceTagId` to the `Community` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Community" DROP CONSTRAINT "Community_problemsetId_fkey";

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "entranceTagId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Problemset" DROP COLUMN "communityId";
