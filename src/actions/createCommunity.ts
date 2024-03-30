'use server';

import prisma from "@/vendor/db";
import { Community, Problem } from "@prisma/client";
interface ProblemDataType{
    question: string,
    type: string,
    answer: AnswerType[],
  }

interface CreateCommunityParams{
    channelId: string,
    name: string,
    description: string,
    imageSrcs: string[],
    problems: ProblemDataType[]
}


  interface problemWithProblemsetIdProps{
    question: string,
    type: string,
    answer: string[],
    emphasis: boolean[],
    problemsetId: string,
  }
  
  interface AnswerType{
    sentence: string,    
    emphasis: boolean    
  }

  interface problemProps {
    question: string,
    type: string,
    answer: AnswerType[],
  }

export async function createCommunity( params: CreateCommunityParams
    ): Promise<Community>{
  
    try {

        const { channelId, name, description, imageSrcs, problems } = params;


        const existingCommunity = await prisma.community.findFirst({
            where: {
                name: name,
            },
        });

        if (existingCommunity) {
            throw new Error("Community already exists.");
        }

        const problemset = await prisma.problemset.create({
            data: {
              channelId: channelId,
            },
          });


          const community = await prisma.community.create({
            data: {
                name: name,
                description: description,
                imageSrcs: imageSrcs,
                problemsetId: problemset.id,
                memberCount: 1,
                approved: true,
            },
        });

        const tag = await prisma.tag.create({
            data: {
                name: name + "Entrance Problemset",
            },
        });


        const problemsWithProblemsetId: problemWithProblemsetIdProps[] = problems.map((item: problemProps) => ({
            problemsetId: problemset.id,
            answer: item.answer.map(obj => obj.sentence),
            type: item.type,
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
                communityId: community.id,
                tags: {
                    connect: { id: tag.id },
                },
                problems: {
                    connect: createdProblems.map((problem: Problem) => ({ id: problem.id })),
                },
            }
          });

          const updatedCommunity = await prisma.community.update({  
            where: {
              id: community.id,
            },
            data: {
              problemset: {
                connect: { id: resultProblemset.id },
              },
              CommunityMember: {
                connect: [{ id: channelId }],
              },
            },
          });

        return updatedCommunity;
        
        } catch (error: any) {
            throw new Error(error);
        }
    }



  