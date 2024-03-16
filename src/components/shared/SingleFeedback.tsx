'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@radix-ui/react-label";
import { RightWrongIcon } from "./RightWrongIcon";


interface AttemptFeedback{
    problemsetNum: number,
    index: number,
    prediction: string,
    perspective: string,
    fail: number[],
}

export const SingleFeedback: React.FC<AttemptFeedback> = ({
    problemsetNum,
    index,
    prediction,
    perspective,
    fail
}) => {
    if (!perspective || !prediction || !fail){
        return null;
    }

    const newSentencesToShow = perspective.split(/(?<=[,.;?!])/).filter(sentence => sentence.trim().replace(/[,.;?!]/, '') !== '');

    return (

        <div className="relative ">
            <div id={"blackboard"+problemsetNum+index} className="flex w-full min-h-[100px] max-h-[210px] mb-2 rounded-md border-[1px] bg-slate-50 border-zinc-50 text-center">
                <Label htmlFor={"blackboard"+problemsetNum+index} className="absolute left-2 top-2 text-lg font-medium text-zinc-500">Result:</Label>
                
                <div className="absolute right-2 top-2">
                    <RightWrongIcon isCorrect={prediction==="pass"}/>
                </div>
                <div className="flex flex-col space-y-2 w-full mx-2 mt-10 mb-2 scroll-smooth overflow-y-auto overflow-x-hidden no-scrollbar">
                    {newSentencesToShow.map((sentence, index) => (
                    
                        <Badge  key={sentence+index}
                                className="flex w-full" 
                                variant="outline">
                            <div className={`flex mr-4 text-left ${fail.includes(index) 
                                    ? "text-red-500"
                                    : "text-slate-600"
                                } text-xl font-sans antialiased break-words`}>
                                {sentence}
                            </div>
                        </Badge>

                    )
                  )}
                </div>

            </div>
        </div>

  );
}