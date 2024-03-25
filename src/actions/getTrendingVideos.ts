'use server';
import prisma from "@/vendor/db";
import { Channel, Video } from "@prisma/client";
import getProblemsetsByVideoId from "./getProblemsetsByVideoId";

interface TrendingReturnType{
  video: Video & {channel: Channel}, 
  questions: string[]
}

export default async function getTrendingVideos(): Promise<TrendingReturnType[]> {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const videos = await prisma.video.findMany({
      include: {
        channel: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
        approved: true,
      },
      orderBy: [
        {
          viewCount: "desc",
        },
      ],
      take: 50,
    });

    const returnedVideos = await Promise.all(videos.map(async(video) => {
      const problemsets = await prisma.problemset.findMany({
        where: {
          videoId: video.id,
        },
        include: {
          problems: true,
        },
        orderBy: [
          {
              likeCount: "desc",
          },
        ],
        take: 5,
      });

      const questions = problemsets.map((problemset) => problemset.problems[0].question);

      return {
        video: video,
        questions: questions,
      };
    }));

    return returnedVideos;
    
  } catch (error: any) {
    throw new Error(error);
  }
}
