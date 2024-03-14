'use server';

import prisma from "@/vendor/db";
import { Problemset, Problem } from "@prisma/client";
import { Config } from 'sst/node/config'


interface SubmitAttemptParams{
    channelId: string,
    problems: Problem[],
    attempts: {attempt: string}[]
  }


async function query(data:any) {
    const response = await fetch(
      Config.HUGGINGFACE_INFERENCE_ENDPOINT!,
        {
            headers: { 
                "Accept" : "application/json",
                "Authorization": "Bearer " + Config.HUGGINGFACE_ACCESS_TOKEN,
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result[0].prediction;
}




export async function submitAttempt( params: SubmitAttemptParams
    ): Promise<Problemset>{
  
    try {
        const {channelId, problems, attempts } = params;

        if (!channelId) {
            throw new Error("");
        }

        const queryBodies = problems.map((problem, index) => ({"inputs": "Hello A4ideo", 
                "answer": problem.answer, "type": problem.type, "emphasis": problem.emphasis,
                "perspective": attempts[index].attempt}));



        const result = await Promise.all(queryBodies.map(async(queryBody) => {return await query(queryBody)}));

        const attemptStatus = result.every(check_PASSED);

        const existedAttempt = await prisma.attempt.findFirst({
        where: {
            channelId: channelId,
            problemsetId: problemsetId,
        },
        });


        if (!existedAttempt) {
        const createdAttempt = await prisma.attempt.create({
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
      
        
        } catch (error: any) {
            throw new Error(error);
        }
    }



  


  