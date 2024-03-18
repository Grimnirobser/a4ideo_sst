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

  let dislikedProblemsetIds = currentChannel.dislikedProblemsetIds;

  dislikedProblemsetIds.push(problemsetId);

  const problemset = await prisma.problemset.update({
    where: {
      id: problemsetId,
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
      dislikedProblemsetIds,
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

  let dislikedProblemsetIds = currentChannel.dislikedProblemsetIds.filter(
    (dislikedProblemsetId) => dislikedProblemsetId !== problemsetId
  );

  const problemset = await prisma.problemset.update({
    where: {
      id: problemsetId,
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
      dislikedProblemsetIds,
    },
  });

  return NextResponse.json({ channel, problemset });
}
