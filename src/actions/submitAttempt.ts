'use server';

import prisma from "@/vendor/db";
import { Problemset, Problem } from "@prisma/client";
import { Config } from 'sst/node/config'


interface SubmitAttemptParams{
    channelId: string,
    problemsetId: string,
    problems: Problem[],
    attempts: {attempt: string}[]
  }

interface QueryFormat{
    inputs: string,
    answer: string[],
    type: string,
    emphasis: boolean[],
    perspective: string
}

interface compareReturnType{
    prediction: string,
    fail: number[],
}

interface AttemptFeedback{
    prediction: string,
    perspective: string,
    fail: number[],
}


export async function submitAttemptInitAction(){} // dirty work related to next.js issue https://github.com/vercel/next.js/issues/54282

async function query(data:QueryFormat): Promise<compareReturnType> {

    if (data.type === "exact"){
        const perspective_paragraph = data.perspective.split(/[,.;?!]+/).map((sentence) => sentence.trim()).filter(sentence => sentence.trim() !== '');
        const fail_lst: number[] = []
        perspective_paragraph.map((sentence, index) => {
            if (data.answer[index] !== sentence){
                fail_lst.push(index);
            }
        });
        return {prediction: fail_lst.length === 0 ? "pass" : "fail", fail: fail_lst};
    }else{
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
        return result[0];
    }
}


function check_PASSED(prediction: string){
    return prediction === "pass";
}

export async function submitAttempt( params: SubmitAttemptParams
    ): Promise<AttemptFeedback[]>{

  
    try {
        const {channelId, problemsetId, problems, attempts } = params;

        if (!channelId) {
            throw new Error("Channel ID is required");
        }

        const queryBodies = problems.map((problem, index) => ({"inputs": "Hello A4ideo", 
                "answer": problem.answer, "type": problem.type, "emphasis": problem.emphasis,
                "perspective": attempts[index].attempt}));

        const result_lst = await Promise.all(queryBodies.map(async(queryBody) => await query(queryBody)));

        const feedback = result_lst.map((single_result, index) => 
            ({prediction: single_result.prediction, perspective: attempts[index].attempt, fail: single_result.fail})
        );

        const result_prediction = result_lst.map((single_result, index) => single_result.prediction);


        const attemptStatus = result_prediction.every(check_PASSED);

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

        return feedback;
        
    } catch (error: any) {
        throw new Error(error);
    }
}



  


  