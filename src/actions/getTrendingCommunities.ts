'use server';
import prisma from "@/vendor/db";
import { Community } from "@prisma/client";


export default async function getTrendingCommunities(): Promise<Community[]> {
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

      orderBy: [
        {
          memberCount: "desc",
        },
      ],
      take: 50,
    });

    return communities;
    
  } catch (error: any) {
    throw new Error(error);
  }
}
