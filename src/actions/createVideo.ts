'use server';

import prisma from "@/vendor/db";
import { createProblemset } from "@/actions/createProblemset";
import { Video } from "@prisma/client";


interface ProblemDataType{
    question: string,
    type: string,
    atTime: number,
    answer: AnswerType[],
  }

interface CreateVideoParams{
    channelId: string,
    title: string,
    description: string,
    youtubeId: string,
    imageSrc: string,
    problems: ProblemDataType[]
}

interface AnswerType{
    sentence: string,    
    emphasis: boolean    
  }


export async function createVideo( params: CreateVideoParams
    ): Promise<Video>{
  
    try {

        const { channelId, title, description, youtubeId, imageSrc, problems } = params;

        if (!channelId) {
            throw new Error("Invalid channelId");
        }

        const video = await prisma.video.create({
            data: {
                channelId: channelId,
                title: title,
                description:description,
                youtubeId: youtubeId,
                imageSrc: imageSrc,
            },
        });

        const problemsetData = {
            videoId: video.id,
            channelId: channelId,
            problems: problems,
        };

        const result = await createProblemset(problemsetData);


        return video;
        
        } catch (error: any) {
            throw new Error(error);
        }
    }



  

