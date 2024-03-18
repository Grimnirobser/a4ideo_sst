import getCurrentChannel from "@/actions/getCurrentChannel";
import prisma from "@/vendor/db";
import { NextResponse } from "next/server";

interface IParams {
  problemsetId: string;
}

export async function POST(_: Request, { params }: { params: IParams }) {
  const currentChannel = await getCurrentChannel();


  const { problemsetId } = params;

  if (!currentChannel || !problemsetId) {
    return NextResponse.error();
  }

  let likedProblemsetIds = currentChannel.likedProblemsetIds;

  likedProblemsetIds.push(problemsetId);

  const problemset = await prisma.problemset.update({
    where: {
      id: problemsetId,
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
      likedProblemsetIds,
    },
  });

  return NextResponse.json({ channel, problemset });
}

export async function DELETE(_: Request, { params }: { params: IParams }) {
  const currentChannel = await getCurrentChannel();

  const { problemsetId } = params;

  if (!currentChannel || !problemsetId) {
    return NextResponse.error();
  }

  let likedProblemsetIds = currentChannel.likedProblemsetIds.filter(
    (likedProblemsetId) => likedProblemsetId !== problemsetId
  );

  const problemset = await prisma.problemset.update({
    where: {
      id: problemsetId,
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
      likedProblemsetIds,
    },
  });

  return NextResponse.json({ channel, problemset });
}
