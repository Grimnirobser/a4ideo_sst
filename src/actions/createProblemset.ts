'use server';

import prisma from "@/vendor/db";
import { Problemset, Problem } from "@prisma/client";


interface problemProps {
  question: string,
  type: string,
  answer: string[],
  emphasis: boolean[]
}

interface problemWithProblemsetIdProps{
  question: string,
  type: string,
  answer: string[],
  emphasis: boolean[],
  problemsetId: string,
}

interface CreateProblemsetParams{
    videoId: string | undefined,
    channelId: string,
    problems: problemProps[]
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
              connect: createdProblems.map((problem: Problem) => ({ id: problem.id })),
            },
          }
        });


        video.problemsets.push(resultProblemset);       

        console.log(resultProblemset);
        console.log(video);
      
        return resultProblemset;
      
      } catch (error: any) {
      throw new Error(error);
      }
  }



  


  