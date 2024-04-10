'use server';
import prisma from "@/vendor/db";
import { Channel, Problemset, Problem} from "@prisma/client";

interface ReturnedProblemDataType{
  question: string,
  type: string,
  atTime: number,
  answer?: string[],
}

export default async function getTrendingProblemsets(): Promise<(Problemset & {channel: Channel} & {problems: Problem[]})[]> {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);

    const trendingProblemsets = await prisma.problemset.findMany({
      include: {
        channel: true,
        problems: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
        // approved: true,
      },
      orderBy: [
        {
          likeCount: "desc",
        },
      ],
      take: 50,
    });

    trendingProblemsets.map((problemset) => {
        problemset.problems.map((problem) => {
          delete (problem as any).type;
          delete (problem as any).answer;
          delete (problem as any).emphasis;
        });
      }
    );

    return trendingProblemsets;
    
  } catch (error: any) {
    throw new Error(error);
  }
}
