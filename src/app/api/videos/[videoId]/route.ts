import getCurrentChannel from "@/actions/getCurrentChannel";
import prisma from "@/vendor/db";
import { NextResponse } from "next/server";
import checkVideoDeletable from "@/actions/checkVideoDeletable";

interface IParams {
  videoId: string;
}


export async function DELETE(_: Request, { params }: { params: IParams }) {
  const currentChannel = await getCurrentChannel();
  const deletable = await checkVideoDeletable({ videoId: params.videoId });

  if (!currentChannel || !deletable) {
    return NextResponse.error();
  }
  
  const video = await prisma.video.delete({
    where: {
      id: params.videoId,
    },
  });

  return NextResponse.json(video);
}
