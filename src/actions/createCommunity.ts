'use server';

import prisma from "@/vendor/db";
import { Community } from "@prisma/client";

interface CreateCommunityParams{
    channelId: string,
    name: string,
    description: string,
    imageSrcs: string[],
    textColor: string,
    backgroundColor: string,
}


export async function createCommunity( params: CreateCommunityParams
    ): Promise<Community>{
  
    try {

        const { channelId, name, description, imageSrcs, textColor, backgroundColor } = params;

        const existingCommunity = await prisma.community.findFirst({
            where: {
                name: name,
            },
        });

        if (existingCommunity) {
            throw new Error("Community already exists.");
        }

        const communityTag = await prisma.tag.create({
            data: {
                name: name.trim() + " Entrance Problemset",
                textColor: textColor,
                bgColor: backgroundColor,
            },
        });

          const community = await prisma.community.create({
            data: {
                name: name,
                description: description,
                imageSrcs: imageSrcs,
                memberCount: 1,
                approved: true,
                entranceTagId: communityTag.id,
                CommunityMember: {
                    connect: [{id: channelId}],
                }
            },
        });

        return community;
        
        } catch (error: any) {
            throw new Error(error);
        }
    }



  