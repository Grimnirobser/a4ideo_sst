import getCurrentChannel from "@/actions/getCurrentChannel";
import prisma from "@/vendor/db";
import { NextResponse } from "next/server";
import checkChannelMembership from "@/actions/checkChannelMembership";

interface IParams {
  communityId: string;
}

export async function POST(_: Request, { params }: { params: IParams }) {
  const currentChannel = await getCurrentChannel();

  const { communityId } = params;

  const isMember = await checkChannelMembership({communityId: communityId});

  if (!currentChannel || !communityId || !isMember) {
    return NextResponse.error();
  }

  let dislikedCommunityIds = currentChannel.dislikedCommunityIds;

  dislikedCommunityIds.push(communityId);

  const community = await prisma.community.update({
    where: {
      id: communityId,
    },
    data: {
      dislikeCount: {
        increment: 1,
      },
    },
  });

  const channel = await prisma.channel.update({
    where: {
      id: currentChannel.id,
    },
    data: {
      dislikedCommunityIds,
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

  let dislikedCommunityIds = currentChannel.dislikedCommunityIds.filter(
    (dislikedCommunityId) => dislikedCommunityId !== communityId
  );

  const community = await prisma.community.update({
    where: {
      id: communityId,
    },
    data: {
      dislikeCount: {
        decrement: 1,
      },
    },
  });

  const channel = await prisma.channel.update({
    where: {
      id: currentChannel.id,
    },
    data: {
      dislikedCommunityIds,
    },
  });

  return NextResponse.json({ channel, community });
}
