/*
  Warnings:

  - You are about to drop the column `backgroundColor` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `bgColor` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "backgroundColor",
ADD COLUMN     "bgColor" TEXT NOT NULL;
