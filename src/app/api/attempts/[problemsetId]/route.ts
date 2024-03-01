import prisma from "@/vendor/db";
import { NextRequest, NextResponse } from "next/server";
import getProblemsByProblemsetId from "@/actions/getProblemsByProblemsetId";

interface attemptProps {
    channelId: string;
    problemsetId: string;
    attempts: string[];
  }

  
async function query(data:any) {
    const response = await fetch(
        "https://kzqov4pidle051dc.us-east-1.aws.endpoints.huggingface.cloud",
        {
            headers: { 
                "Accept" : "application/json",
                "Authorization": "Bearer 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",
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result[0].result;
}


function check_PASSED(content: string){
    return content == "PASSED";
}

export async function POST(request: Request) {

    
    const {channelId, problemsetId, attempts } = await request.json();

    const problems = await getProblemsByProblemsetId(problemsetId);

    if (!problems) {
        return NextResponse.json(null);
    }
    const queryBodies = problems.map((problem, index) => ({"inputs": "Hello A4ideo", "answer": problem.answer, "type": problem.type, "perspective": attempts[index].attempt}));

    const result = await Promise.all(queryBodies.map(async(queryBody) => {return await query(queryBody)}));

    const attemptStatus = result.every(check_PASSED);

    const existedAttempt = await prisma.attempt.findFirst({
      where: {
        channelId: channelId,
        problemsetId: problemsetId,
      },
    });


    if (!existedAttempt) {
      const updatedAttempt = await prisma.attempt.create({
        data: {
            channelId: channelId,
            problemsetId: problemsetId,
            correct: attemptStatus
        },
      });
    }else{
      const updatedAttempt = await prisma.attempt.update({
        where: {
          id: existedAttempt.id,
        },
        data: {
          correct: attemptStatus,
        },
      });
    }
    
    return NextResponse.json(attemptStatus);
  }