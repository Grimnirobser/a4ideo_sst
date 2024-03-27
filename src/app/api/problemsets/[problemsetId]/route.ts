import getCurrentChannel from "@/actions/getCurrentChannel";
import prisma from "@/vendor/db";
import { NextResponse } from "next/server";
import checkProblemsetDeletable from "@/actions/checkProblemsetDeletable";

interface IParams {
  problemsetId: string;
}

export async function DELETE(_: Request, { params }: { params: IParams }) {
  const currentChannel = await getCurrentChannel();
  const { problemsetId } = params;
  const deletable = await checkProblemsetDeletable({ problemsetId });

  if (!currentChannel || !deletable) {
    return NextResponse.error();
  }
  
  const problemset = await prisma.problemset.delete({
    where: {
      id: problemsetId,
    },
  });

  return NextResponse.json(problemset);
}
