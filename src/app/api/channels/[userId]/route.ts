import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/vendor/db";
import { NextResponse } from "next/server";




export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { userId, username, handle, imageSrc } = await request.json();

  if (currentUser.id !== userId) {
    return NextResponse.error();
  }

  const channel = await prisma.channel.create({
    data: {
      username,
      handle,
      imageSrc,
      userId,
    },
  });

  return NextResponse.json(channel);
}