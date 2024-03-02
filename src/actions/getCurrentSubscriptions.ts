'use server';
import { Channel } from "@prisma/client";
import prisma from "@/vendor/db";
import getCurrentChannel from "./getCurrentChannel";

export default async function getCurrentSubscriptions(): Promise<Channel[]> {
  try {
    const currentChannel = await getCurrentChannel();

    if (!currentChannel) {
      return [];
    }

    const subscriptions = await prisma.channel.findMany({
      where: {
        id: {
          in: currentChannel.subscribedChannelIds,
        },
      },
    });

    return subscriptions;
  } catch (error: any) {
    throw new Error(error);
  }
}
