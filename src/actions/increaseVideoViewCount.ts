'use server';
import { Video } from "@prisma/client";
import prisma from "@/vendor/db";

interface IncreaseVideoViewCountParams {
  videoId?: string;
}

export default async function increaseVideoViewCount(
  params: IncreaseVideoViewCountParams
): Promise<Video | null> {
  try {
    const { videoId } = params;

    const query: any = {};

    if (videoId) {
      query.id = videoId;
    }

    const video = await prisma.video.updateIgnoreOnNotFound({
      where: query,
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return video;
  } catch (error: any) {
    throw new Error(error);
  }
}
