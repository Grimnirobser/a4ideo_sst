'use server';

import prisma from "@/vendor/db";
import { Problemset, Problem } from "@prisma/client";


interface problemProps {
  question: string,
  type: string,
  atTime: number,
  answer: AnswerType[],
}

interface UpdateProblemsetParams{
    problemsetId: string,
    deleteProblemIds: string[],
    updateProblemIds: string[],
    problems: problemProps[]
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



export default async function updateProblemset( params: UpdateProblemsetParams
    ): Promise<Problemset>{
  
    try {
        const {problemsetId, deleteProblemIds, updateProblemIds, problems } = params;

        const createProblems = problems.slice(updateProblemIds.length);
        const createProblemsWithProblemsetId: problemWithProblemsetIdProps[] = createProblems.map((item: problemProps) => ({
          problemsetId: problemsetId,
          answer: item.answer.map(obj => obj.sentence),
          type: item.type,
          atTime: item.atTime,
          question: item.question,
          emphasis: item.answer.map(obj => obj.emphasis),
        }));

        await prisma.problem.deleteMany({
          where: {
            id: {
              in: deleteProblemIds,
            },
          },
        });


        await Promise.all(updateProblemIds.map(async(updateProblemId, index) => 
              await prisma.problem.update({
                where: {
                  id: updateProblemId,
                  },
                  data: {
                    question: problems[index].question,
                    type: problems[index].type,
                    answer: problems[index].answer.map(obj => obj.sentence),
                    emphasis: problems[index].answer.map(obj => obj.emphasis),
                    atTime: problems[index].atTime,
                  },
              })
        ));

        const createdProblems = await prisma.$transaction(
            createProblemsWithProblemsetId.map((createProblemWithProblemsetId: problemWithProblemsetIdProps) => prisma.problem.create({ data: createProblemWithProblemsetId })),
        );

        const createProblemsIds = createdProblems.map((problem: Problem) => problem.id);
        const resultProblemsIds = updateProblemIds.concat(createProblemsIds);

        const resultProblemset = await prisma.problemset.update({
          where: {
            id: problemsetId,
          },
          data: {
            problems: {
              connect: resultProblemsIds.map((problemId: string) => ({ id: problemId })),
            },
          }
        });

        return resultProblemset;
      
      } catch (error: any) {
      throw new Error(error);
      }
  }



  
