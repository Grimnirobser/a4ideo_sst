import prisma from "@/vendor/db";
import { NextRequest, NextResponse } from "next/server";


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



export async function POST(request: Request) {
  
    const {videoId, channelId, problems } = await request.json();
  

    const problemset = await prisma.problemset.create({
      data: {
        videoId,
        channelId,
      },
    });

    const problemsWithProblemsetId = problems.map((item: problemProps) => ({...item, problemsetId: problemset.id}));

    const createdProblems = await prisma.$transaction(
      problemsWithProblemsetId.map((problemWithProblemsetId: problemWithProblemsetIdProps) => prisma.questionAndAnswer.create({ data: problemWithProblemsetId })),
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
  
    return NextResponse.json(resultProblemset);
  }
  