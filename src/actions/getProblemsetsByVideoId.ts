import prisma from "@/vendor/db";
import { Channel, Problemset } from "@prisma/client";

interface GetProblemsetsByVideoIdParams {
  videoId?: string;
}

export default async function getProblemsetsByVideoId(
  params: GetProblemsetsByVideoIdParams
): Promise<(Problemset & { channel: Channel })[] | null> {
  try {
    const { videoId } = params;

    const query: any = {};

    if (videoId) {
      query.videoId = videoId;
    }

    const problemsets = await prisma.problemset.findMany({
      where: query,
      include: {
        channel: true,
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
