'use server';
import prisma from "@/vendor/db";
import getCurrentChannel from "@/actions/getCurrentChannel";


interface CheckProblemsetDeletableParams {
  problemsetId: string;
}

export async function checkProblemsetDeletableInitAction(){}
// checkProblemsetDelete checks if the problemset is deletable or not
// meaning if the problemsets on the problemset are all belonged to the channel

export default async function checkProblemsetDeletable(params: CheckProblemsetDeletableParams): Promise<boolean> {
  try {
    const currentChannel = await getCurrentChannel();
    if (!currentChannel) {
      return false;
    }

    const { problemsetId } = params;    

    const problemset = await prisma.problemset.findUnique({
      where: {
        id: problemsetId,
      },
    });


    if (!problemset || problemset.channelId !== currentChannel.id) {
      return false;
    }

    const video = await prisma.video.findUnique({
        where: {
            id: problemset.videoId,
        },
        include: {
            problemsets: true,
        },

    });

    if (!video) {
        return true;
    }


    return video.problemsets.length > 1;
    
  } catch (error: any) {
    throw new Error(error);
  }
}
