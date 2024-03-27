'use server';
import prisma from "@/vendor/db";
import { Problemset, Problem } from "@prisma/client";

interface GetProblemsetsByChannelIdParams {
  channelId?: string;
}

export default async function getProblemsetsByChannelId(
  params: GetProblemsetsByChannelIdParams
): Promise<(Problemset & {problems: Problem[]})[]> {
  try {
    const { channelId } = params;

    const query: any = {};

    if (channelId) {
      query.channelId = channelId;
    }

    const problemsets = await prisma.problemset.findMany({
      where: query,
      include: {
        problems: true,
      },
    });

    return problemsets || [];
  } catch (error: any) {
    throw new Error(error);
  }
}
