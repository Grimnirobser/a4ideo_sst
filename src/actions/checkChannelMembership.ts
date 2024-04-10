'use server';

import prisma from "@/vendor/db";
import getCurrentChannel from "@/actions/getCurrentChannel";


interface GetCommunityByUsernameParams {
  communityId?: string;
}

export async function checkChannelMembershipInitAction(){}

export default async function checkChannelMembership(
  params: GetCommunityByUsernameParams
): Promise<Boolean> {
  try {
    const { communityId } = params;
    const currentChannel = await getCurrentChannel();

    if (!currentChannel) {
      return false;
    }

    const community = await prisma.community.findUnique({
      where: {
        id: communityId,
      },
      include: {
        CommunityMember: true,
      },
    });

    if (!community) {
        return false;
    }

    return  community.CommunityMember.some(member => member.id === currentChannel.id);


  } catch (error: any) {
    throw new Error(error);
  }
}
