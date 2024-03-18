'use server';

import prisma from "@/vendor/db";
import { Channel } from "@prisma/client";

interface GetChannelByUsernameParams {
  username: string;
}

export default async function getChannelByUsername(
  params: GetChannelByUsernameParams
): Promise<Boolean> {
  try {
    const { username } = params;

    if (!username) {
        return false;
    }

    const channel = await prisma.channel.findFirst({
      where: {
        username: username,
      },
    });

    if (!channel) {
        return true;
    }else{
        return false;
    }

  } catch (error: any) {
    throw new Error(error);
  }
}
