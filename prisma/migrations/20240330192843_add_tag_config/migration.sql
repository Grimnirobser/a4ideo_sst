/*
  Warnings:

  - Added the required column `backgroundColor` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textColor` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "backgroundColor" TEXT NOT NULL,
ADD COLUMN     "textColor" TEXT NOT NULL;
