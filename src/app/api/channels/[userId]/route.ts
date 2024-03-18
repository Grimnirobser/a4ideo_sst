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

    const existingChannel = await prisma.channel.findFirst({
        where: {
            OR: [
                {
                    username: username,
                },
                {
                    userId: userId,
                },
            ],
        },
    });

    if (existingChannel) {
        return NextResponse.error();
    }

    const channel = await prisma.channel.create({
        data: {
            username,
            imageSrc,
            userId,
        },
    });

  return NextResponse.json(channel);
}