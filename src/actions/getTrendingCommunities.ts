'use server';
import prisma from "@/vendor/db";
import { Community } from "@prisma/client";


interface TrendingReturnType{
  community: Community, 
  questions: string[] | undefined,
}

export default async function getTrendingCommunities(): Promise<TrendingReturnType[]> {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const communities = await prisma.community.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        approved: true,
      },
      include: {
        problemset: true,
      },
      orderBy: [
        {
          memberCount: "desc",
        },
      ],
      take: 50,
    });

    const returnedCommunities = await Promise.all(communities.map(async(community) => {
      const problemset = await prisma.problemset.findUnique({
        where: {
          id: community.problemsetId,
        },
        include: {
          problems: true,
        },
        });

      const questions = problemset?.problems.map((problem) => problem.question);

      return {
        community: community,
        questions: questions,
      };
    }));

    return returnedCommunities;
    
  } catch (error: any) {
    throw new Error(error);
  }
}
