'use server';

import prisma from "@/vendor/db";
import { Channel, Video, Problemset } from "@prisma/client";

interface GetInfoByUsernameParams {
  username?: string;
}

interface GetInfoByUsernameReturnData {
  channel: Channel | null;
  videos: Video[];
  problemsets: Problemset[];
}

export default async function getInfoByUsername(
  params: GetInfoByUsernameParams
): Promise<GetInfoByUsernameReturnData> {
  try {
    const { username } = params;

    if (!username) {
        return {
            channel: null,
            videos: [],
            problemsets: [],
          };
    }

    const channel = await prisma.channel.findFirst({
      where: {
        username: username,
      },
    });

    if (!channel) {
      return {
        channel: null,
        videos: [],
        problemsets: [],
      };
    }

    const videos = await prisma.video.findMany({
      where: {
        channelId: channel.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const problemsets = await prisma.problemset.findMany({
      where: {
        channelId: channel.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      channel: channel,
      videos: videos,
      problemsets: problemsets,
    };


  } catch (error: any) {
    throw new Error(error);
  }
}
