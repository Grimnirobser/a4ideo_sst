import getCurrentChannel from "@/actions/getCurrentChannel";
import prisma from "@/vendor/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

  const currentChannel = await getCurrentChannel();


  if (!currentChannel) {
    return NextResponse.error();
  }

  const { channelId } = await request.json();

  await prisma.channel.update({
    where: {
      id: channelId,
    },
    data: {
      subscriberCount: { increment: 1 },
    },
  });

  const subscribedChannelIds = currentChannel.subscribedChannelIds;

  subscribedChannelIds.push(channelId);

  const updatedChannel = await prisma.channel.update({
    where: {
      id: currentChannel.id,
    },
    data: {
      subscribedChannelIds,
    },
  });

  return NextResponse.json(updatedChannel);
}

export async function DELETE(request: Request) {
  const currentChannel = await getCurrentChannel();

  if (!currentChannel) {
    return NextResponse.error();
  }

  const { channelId } = await request.json();

  await prisma.channel.update({
    where: {
      id: channelId,
    },
    data: {
      subscriberCount: { decrement: 1 },
    },
  });

  const subscribedChannelIds = currentChannel.subscribedChannelIds.filter(
    (subscribedChannelId) => subscribedChannelId !== channelId
  );

  const updatedChannel = await prisma.channel.update({
    where: {
      id: currentChannel.id,
    },
    data: {
      subscribedChannelIds,
    },
  });

  return NextResponse.json(updatedChannel);
}
