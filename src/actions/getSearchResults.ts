'use server';

import prisma from "@/vendor/db";
import { Channel, Video } from "@prisma/client";

interface GetSearchResultsParams{
  searchQuery: string | null;
}

export default async function getSearchResults(
  params: GetSearchResultsParams
): Promise<
  (Video & { channel: Channel })[] | null
> {

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


    return videos;
  } catch (error: any) {

    throw new Error(error);
  }
  
}
