'use server';

import prisma from "@/vendor/db";
import { Channel, Video } from "@prisma/client";

interface GetSearchResultsParams{
  searchQuery: string | null;
}

interface SearchReturnType{
  video: Video & {channel: Channel}, 
  questions: string[]
}

export default async function getSearchResults(
  params: GetSearchResultsParams
): Promise<SearchReturnType[] | null> {

  const { searchQuery } = params;

  if (!searchQuery) {
    return null;
  }

  try {
    const videos = await prisma.video.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        channel: true,
      },
      orderBy: [
        {
          viewCount: "desc",
        },
      ],
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
