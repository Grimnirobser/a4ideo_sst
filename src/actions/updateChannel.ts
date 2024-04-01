'use server';

import prisma from "@/vendor/db";
import { Channel } from "@prisma/client";
import getCurrentUser from "@/actions/getCurrentUser";
interface UpdateChannelParams{
    userId: string;
    username: string;
    imageSrc: string;
}

export async function updateChannel( params: UpdateChannelParams
    ): Promise<Channel>{
  
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            throw new Error("Request not sign in.");
        }

        const { userId, username, imageSrc } = params;

        if (currentUser.id !== userId) {
            throw new Error("Two user ids do not match.");
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

        return channel;
        
        } catch (error: any) {
            throw new Error(error);
        }
    }



  