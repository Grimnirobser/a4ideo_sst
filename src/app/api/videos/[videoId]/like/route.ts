import getCurrentChannel from "@/actions/getCurrentChannel";
import prisma from "@/vendor/db";
import { NextResponse } from "next/server";

interface IParams {
  videoId: string;
}

export async function POST(_: Request, { params }: { params: IParams }) {
  const currentChannel = await getCurrentChannel();


  const { videoId } = params;

  if (!currentChannel || !videoId) {
    return NextResponse.error();
  }

  let likedVideoIds = currentChannel.likedVideoIds;

  likedVideoIds.push(videoId);

  const video = await prisma.video.update({
    where: {
      id: videoId,
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
      likedVideoIds,
    },
  });

  return NextResponse.json({ channel, video });
}

export async function DELETE(_: Request, { params }: { params: IParams }) {
  const currentChannel = await getCurrentChannel();

  const { videoId } = params;

  if (!currentChannel || !videoId) {
    return NextResponse.error();
  }

  let likedVideoIds = currentChannel.likedVideoIds.filter(
    (likedVideoId) => likedVideoId !== videoId
  );

  const video = await prisma.video.update({
    where: {
      id: videoId,
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
      likedVideoIds,
    },
  });

  return NextResponse.json({ channel, video });
}
