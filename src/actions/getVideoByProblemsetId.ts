'use server';

import prisma from "@/vendor/db";
import { Video, Channel } from "@prisma/client";

interface GetVideoByProblemsetIdParams {
  problemsetId: string;
}

export default async function getVideoByProblemsetId(
  params: GetVideoByProblemsetIdParams
): Promise<Video & {channel: Channel}> {
  try {
    const { problemsetId } = params;

    const problemset = await prisma.problemset.findFirst({
      where: {
        id: problemsetId,
      },
    });

    if (!problemset) {
      throw new Error("Problemset not found");
    }

    const video = await prisma.video.findFirst({
      where: {
        id: problemset.videoId,
      },
      include: {
        channel: true,  
      },
    });

    if (!video) {
      throw new Error("Video not found");
    }

    return video;
  } catch (error: any) {
    throw new Error(error);
  }
}
