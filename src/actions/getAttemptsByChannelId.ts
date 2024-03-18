'use server';
import prisma from "@/vendor/db";
import { Attempt } from "@prisma/client";

interface GetAttemptsByChannelIdParams {
  channelId?: string;
}

export default async function getAttemptsByChannelId(
  params: GetAttemptsByChannelIdParams
): Promise<Attempt[]> {
  try {
    const { channelId } = params;

    const query: any = {};

    if (channelId) {
      query.channelId = channelId;
    }

    const attempts = await prisma.attempt.findMany({
      where: query,
    });

    return attempts || [];
  } catch (error: any) {
    throw new Error(error);
  }
}
