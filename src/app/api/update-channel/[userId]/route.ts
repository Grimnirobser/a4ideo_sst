import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/vendor/db";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { userId, username, imageSrc } = await request.json();

    if (currentUser.id !== userId) {
        return NextResponse.error();
    }

    const channel = await prisma.channel.update({
        where: {
            userId,
        },
        data: {
            username,
            imageSrc,
        },
    });

  return NextResponse.json(channel);
}