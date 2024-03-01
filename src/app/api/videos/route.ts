import { Problemset } from './../../../../node_modules/.prisma/client/index.d';
import getCurrentChannel from "@/actions/getCurrentChannel";
import prisma from "@/vendor/db";
import { NextRequest, NextResponse } from "next/server";




export async function GET(request: NextRequest) {
  const searchQuery = request.nextUrl.searchParams.get("searchQuery");

  if (!searchQuery) return NextResponse.error();

  const videos = await prisma.video.aggregateRaw({
    pipeline: [
      {
        $search: {
          index: "default",
          text: {
            query: searchQuery,
            path: {
              wildcard: "*",
            },
          },
        },
      },
      {
        $lookup: {
          from: "Channel",
          localField: "channelId",
          foreignField: "_id",
          as: "channel",
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          title: 1,
          description: 1,
          createdAt: { $dateToString: { date: "$createdAt" } },
          thumbnailSrc: 1,
          viewCount: 1,
          channel: { $arrayElemAt: ["$channel", 0] },
        },
      },
    ],
  });

  return NextResponse.json(videos);
}



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
