'use server';

import prisma from "@/vendor/db";
import { Video, Problemset } from "@prisma/client";

interface GetVideoByIdParams {
  videoId: string;
}

export default async function getVideoById(
  params: GetVideoByIdParams
): Promise<Video & {problemsets: Problemset[]}> {
  try {
    const { videoId } = params;

    const query: any = {};

    if (videoId) {
      query.id = videoId;
    }

    const video = await prisma.video.findFirst({
      where: query,
      include: {
        problemsets: true,  
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
