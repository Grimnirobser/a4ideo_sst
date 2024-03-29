/*
  Warnings:

  - You are about to drop the `CommunityMember` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tagId` to the `Community` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommunityMember" DROP CONSTRAINT "CommunityMember_channelId_fkey";

-- DropForeignKey
ALTER TABLE "CommunityMember" DROP CONSTRAINT "CommunityMember_communityId_fkey";

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "tagId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CommunityMember";

-- CreateTable
CREATE TABLE "_ChannelToCommunity" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToCommunity_AB_unique" ON "_ChannelToCommunity"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToCommunity_B_index" ON "_ChannelToCommunity"("B");

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToCommunity" ADD CONSTRAINT "_ChannelToCommunity_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToCommunity" ADD CONSTRAINT "_ChannelToCommunity_B_fkey" FOREIGN KEY ("B") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
