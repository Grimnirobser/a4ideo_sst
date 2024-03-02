'use server';
import { Channel, Video } from "@prisma/client";
import getCurrentChannel from "./getCurrentChannel";
import prisma from "@/vendor/db";

export default async function getSubscriptionVideos(): Promise<
  (Video & { channel: Channel })[]
> {
  const currentChannel = await getCurrentChannel();

  try {
    const videos = await prisma.video.findMany({
      where: {
        channelId: {
          in: currentChannel?.subscribedChannelIds,
        },
      },
      include: {
        channel: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    return videos;
  } catch (error: any) {
    throw new Error(error);
  }
}
