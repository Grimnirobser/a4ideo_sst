'use server';
import prisma from "@/vendor/db";
import { Problem } from "@prisma/client";

interface returnDataType{
    problems: Problem[],
    channelId: string,
}

export default async function getProblemsByProblemsetId(
    problemsetId: string
  ): Promise<returnDataType | null> {

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
        return null;
    }

    const returnData = {
        problems: problemset.problems,
        channelId: problemset.channelId,
    }

    return returnData;

  } catch (error: any) {
    throw new Error(error);
  }
}