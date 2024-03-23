'use server';
import prisma from "@/vendor/db";
import { Channel, Video } from "@prisma/client";

export default async function getUnapprovedVideos(): Promise<
  (Video & { channel: Channel })[]
> {
  try {

    const videos = await prisma.video.findMany({
      include: {
        channel: true,
      },
      where: {
        approved:{
            equals: false
        }
      },
      orderBy: [
        {
            createdAt: "desc",
        },
      ],
      take: 50,
    });

    return videos;
  } catch (error: any) {
    throw new Error(error);
  }
}
