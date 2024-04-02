'use server';
import { Video } from "@prisma/client";
import prisma from "@/vendor/db";

interface IncreaseReputationParams {
  channelId?: string;
}

export default async function increaseReputation(
  params: IncreaseReputationParams
): Promise<boolean> {
  try {
    const { channelId } = params;

    const query: any = {};

    if (channelId) {
      query.id = channelId;
    }

    const video = await prisma.channel.updateIgnoreOnNotFound({
      where: query,
      data: {
        reputation: {
          increment: 1,
        },
      },
    });

    return true;

  } catch (error: any) {
    throw new Error(error);
  }
}
