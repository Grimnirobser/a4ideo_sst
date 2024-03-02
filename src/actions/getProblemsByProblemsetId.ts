'use server';
import prisma from "@/vendor/db";
import { QuestionAndAnswer as Problem } from "@prisma/client";


export default async function getProblemsByProblemsetId(
  problemsetId: string
  ): Promise<(Problem)[] | null> {

  try {
    const query: any = {};
    if (problemsetId) {
      query.problemsetId = problemsetId;
    }
    const problemset = await prisma.problemset.findUnique({
      where:{
        id: problemsetId,
      },
        include: {
            problems: true,
        },
    });

    if(!problemset || !problemset.problems){
      throw new Error("Invalid Problemset Id.");
    }

    return problemset.problems;
  } catch (error: any) {
    throw new Error(error);
  }
}
