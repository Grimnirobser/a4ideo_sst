'use server';
import prisma from "@/vendor/db";
import { Channel, Problemset, Problem } from "@prisma/client";

interface GetProblemsetsByVideoIdParams {
  videoId?: string;
}

export default async function getProblemsetsByVideoId(
  params: GetProblemsetsByVideoIdParams
): Promise<(Problemset & { channel: Channel, problems: Problem[] })[] | null> {
  try {
    const { videoId } = params;

    const query: any = {};

    if (videoId) {
      query.videoId = videoId;
      // query.approved = true;
    }

    const problemsets = await prisma.problemset.findMany({
      where: query,
      include: {
        channel: true,
        problems: true,
      },
      orderBy: [
        {
            likeCount: "desc",
        },
      ],
    });

    
    return problemsets;
    
  } catch (error: any) {
    throw new Error(error);
  }
}
