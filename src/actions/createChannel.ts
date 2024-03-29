'use server';

import prisma from "@/vendor/db";
import { Channel } from "@prisma/client";
import getCurrentUser from "@/actions/getCurrentUser";
interface CreateChannelParams{
    userId: string;
    username: string;
    imageSrc: string;
}

export async function createChannel( params: CreateChannelParams
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
            throw new Error("Username already exists.");
        }

        const channel = await prisma.channel.create({
            data: {
                username,
                imageSrc,
                userId,
            },
        });


        return channel;
        
        } catch (error: any) {
            throw new Error(error);
        }
    }



  

