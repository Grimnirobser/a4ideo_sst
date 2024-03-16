'use client';

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"


interface AttemptFeedback{
    prediction: string,
    perspective: string,
    fail: number[],
}

export const SingleFeedback: React.FC<AttemptFeedback> = ({
    prediction,
    perspective,
    fail
}) => {
    console.log(perspective)
    const newSentencesToShow = perspective.split(/(?<=[,.;?!])/).filter(sentence => sentence.trim().replace(/[,.;?!]/, '') !== '');

    return (

        <div className="relative ">
            <div className="flex w-full min-h-[422px] max-h-[422px] mb-2 rounded-md border-[1px] bg-slate-100 border-zinc-500 focus:border-blue-400 text-center">
            <Checkbox className="absolute left-2 top-2 h-4 w-4" checked={prediction==="pass"} />

                <div className="flex flex-col space-y-2 w-full mx-2 mt-12 mb-2 scroll-smooth overflow-y-auto overflow-x-hidden">
                    {newSentencesToShow.map((sentence, index) => (
                    
                        <Badge  key={sentence+index}
                                className="flex w-full" 
                                variant={fail.includes(index) ? "destructive" : "passed"}>
                            <div className="flex ml-6 mr-8 text-left text-xl text-slate-700 font-sans antialiased break-all">
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