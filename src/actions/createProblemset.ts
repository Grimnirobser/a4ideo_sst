'use server';

import prisma from "@/vendor/db";
import { Problemset } from "@prisma/client";


interface problemProps {
  question: string;
  type: string;
  answer: string;
}

interface problemWithProblemsetIdProps{
  question: string;
  type: string;
  answer: string;
  problemsetId: string;

}

interface CreateProblemsetParams{
    videoId: string | undefined,
    channelId: string,
    problems: any
  
}



export async function createProblemset( params: CreateProblemsetParams
    ): Promise<Problemset>{
  
    try {
        const {videoId, channelId, problems } = params;

        const video = await prisma.video.findUnique({
            where: {
              id: videoId!,
            },
            include: {
                problemsets: true,
                },
          });
      
          if (!video) {
            throw new Error("Invalid videoId");
          }

        const problemset = await prisma.problemset.create({
            data: {
              videoId: videoId!,
              channelId: channelId,
            },
          });
      
          const problemsWithProblemsetId = problems.map((item: problemProps) => ({...item, problemsetId: problemset.id}));
      
          const createdProblems = await prisma.$transaction(
            problemsWithProblemsetId.map((problemWithProblemsetId: problemWithProblemsetIdProps) => prisma.problem.create({ data: problemWithProblemsetId })),
         );
         
          const resultProblemset = await prisma.problemset.update({
            where: {
              id: problemset.id,
            },
            data: {
              problems: {
                set: createdProblems,
              },
            },
          });
          
          video.problemsets.push(resultProblemset);       
      
          return resultProblemset;
        
        } catch (error: any) {
        throw new Error(error);
        }
    }



  


  