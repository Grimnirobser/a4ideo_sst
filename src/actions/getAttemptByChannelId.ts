'use server'

import prisma from "@/vendor/db";


interface GetAttemptByChannelIdParams {
    problemsetId: string;
    channelId?: string
}   

export default async function getAttemptByChannelId(
  params: GetAttemptByChannelIdParams
): Promise<Boolean> {

  try {
    const { problemsetId, channelId } = params;

    if (!channelId) {
      return false;
    }


    const attempt = await prisma.attempt.findFirst({
      where:{
        channelId: channelId,
        problemsetId: problemsetId,
      },
    });

    if(!attempt){
      return false;
    }

    return attempt.correct;
  } catch (error: any) {
    throw new Error(error);
  }
}
