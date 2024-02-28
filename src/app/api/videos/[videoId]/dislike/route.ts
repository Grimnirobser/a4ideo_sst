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

  let dislikedVideoIds = currentChannel.dislikedVideoIds;

  dislikedVideoIds.push(videoId);

  const video = await prisma.video.update({
    where: {
      id: videoId,
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
      dislikedVideoIds,
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

  let dislikedVideoIds = currentChannel.dislikedVideoIds.filter(
    (dislikedVideoId) => dislikedVideoId !== videoId
  );

  const video = await prisma.video.update({
    where: {
      id: videoId,
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
      dislikedVideoIds,
    },
  });

  return NextResponse.json({ channel, video });
}
