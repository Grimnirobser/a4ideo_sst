'use server';
import prisma from "@/vendor/db";
import { Problemset } from "@prisma/client";

interface GetProblemsetsByChannelIdParams {
  channelId?: string;
}

export default async function getProblemsetsByChannelId(
  params: GetProblemsetsByChannelIdParams
): Promise<Problemset[]> {
  try {
    const { channelId } = params;

    const query: any = {};

    if (channelId) {
      query.channelId = channelId;
    }

    const problemsets = await prisma.problemset.findMany({
      where: query,
    });

    return problemsets || [];
  } catch (error: any) {
    throw new Error(error);
  }
}
