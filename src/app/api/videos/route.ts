import getCurrentChannel from "@/actions/getCurrentChannel";
import prisma from "@/vendor/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentChannel = await getCurrentChannel();

  if (!currentChannel) {
    return NextResponse.error();
  }

  const { title, description, youtubeId, thumbnailSrc, problems } =
    await request.json();

  const video = await prisma.video.create({
    data: {
      title: title,
      description:description,
      youtubeId: youtubeId,
      thumbnailSrc: thumbnailSrc,
      channelId: currentChannel?.id,
    },
  });

  const problemsetData = {
    videoId: video.id,
    channelId: currentChannel.id,
    problems: problems,
  };

  const result = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + `/api/problemsets/${video.id}`, {
    method: "POST",
    body: JSON.stringify(problemsetData),
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json",
    },
  
  });

  return NextResponse.json(video);
}
