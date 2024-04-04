'use server';
import prisma from "@/vendor/db";
import { Channel, Problemset, Problem } from "@prisma/client";

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

    return trendingProblemsets;
    
  } catch (error: any) {
    throw new Error(error);
  }
}
