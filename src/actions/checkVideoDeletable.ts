'use server';
import prisma from "@/vendor/db";
import getCurrentChannel from "@/actions/getCurrentChannel";


interface CheckVideoDeletableParams {
  videoId: string;
}

export async function checkVideoDeletableInitAction(){}
// checkVideoDelete checks if the video is deletable or not
// meaning if the problemsets on the video are all belonged to the channel

export default async function checkVideoDeletable(params: CheckVideoDeletableParams): Promise<boolean> {
  try {
    const currentChannel = await getCurrentChannel();
    if (!currentChannel) {
      return false;
    }

    const {videoId} = params;    
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
      include: {
        channel: true,
        problemsets: true,
      },
    });

    if (!video || video.channelId !== currentChannel.id) {
      return false;
    }

    const totalVideoProblemsetsChannelIds = video.problemsets.map((problemset) => problemset.channelId);
    const deletable = totalVideoProblemsetsChannelIds.every(problemChannelId => problemChannelId === currentChannel.id);


    return deletable;
    
  } catch (error: any) {
    throw new Error(error);
  }
}
