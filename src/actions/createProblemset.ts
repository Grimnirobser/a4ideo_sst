'use server';

import prisma from "@/vendor/db";
import { Problemset, Problem } from "@prisma/client";


interface problemProps {
  question: string,
  type: string,
  atTime: number,
  answer: AnswerType[],
}

interface CreateProblemsetParams{
    videoId: string | undefined,
    channelId: string,
    problems: problemProps[]
}


interface problemWithProblemsetIdProps{
  question: string,
  type: string,
  atTime: number,
  answer: string[],
  emphasis: boolean[],
  problemsetId: string,
}

interface AnswerType{
  sentence: string,    
  emphasis: boolean    
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

      
        const problemsWithProblemsetId: problemWithProblemsetIdProps[] = problems.map((item: problemProps) => ({
            problemsetId: problemset.id,
            answer: item.answer.map(obj => obj.sentence),
            type: item.type,
            atTime: item.atTime,
            question: item.question,
            emphasis: item.answer.map(obj => obj.emphasis),
          }));
    
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
                
        const updatedVideo = await prisma.video.update({  
          where: {
            id: videoId!,
          },
          data: {
            problemsets: {
              connect: [{ id: resultProblemset.id }],
            },
          },
        });
      
        return resultProblemset;
      
      } catch (error: any) {
      throw new Error(error);
      }
  }



  


  