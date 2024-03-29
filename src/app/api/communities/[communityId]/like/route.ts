import getCurrentChannel from "@/actions/getCurrentChannel";
import prisma from "@/vendor/db";
import { NextResponse } from "next/server";

interface IParams {
  communityId: string;
}

export async function POST(_: Request, { params }: { params: IParams }) {
  const currentChannel = await getCurrentChannel();


  const { communityId } = params;

  if (!currentChannel || !communityId) {
    return NextResponse.error();
  }

  let likedCommunityIds = currentChannel.likedCommunityIds;

  likedCommunityIds.push(communityId);

  const community = await prisma.community.update({
    where: {
      id: communityId,
    },
    data: {
      likeCount: {
        increment: 1,
      },
    },
  });

  const channel = await prisma.channel.update({
    where: {
      id: currentChannel.id,
    },
    data: {
      likedCommunityIds,
    },
  });

  return NextResponse.json({ channel, community });
}

export async function DELETE(_: Request, { params }: { params: IParams }) {
  const currentChannel = await getCurrentChannel();

  const { communityId } = params;

  if (!currentChannel || !communityId) {
    return NextResponse.error();
  }

  let likedCommunityIds = currentChannel.likedCommunityIds.filter(
    (likedCommunityId) => likedCommunityId !== communityId
  );

  const community = await prisma.community.update({
    where: {
      id: communityId,
    },
    data: {
      likeCount: {
        decrement: 1,
      },
    },
  });

  const channel = await prisma.channel.update({
    where: {
      id: currentChannel.id,
    },
    data: {
      likedCommunityIds,
    },
  });

  return NextResponse.json({ channel, community });
}
