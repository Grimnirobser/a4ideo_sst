'use client';

import { RightWrongIcon } from "./RightWrongIcon";


interface AttemptFeedback{
    prediction: string,
    hit_emphasis: string,
}

export const SingleFeedback: React.FC<AttemptFeedback> = ({
    prediction,
    hit_emphasis
}) => {
    if (!prediction || !hit_emphasis){
        return null;
    }

    return (

        <div className="relative ">
            <div className="flex w-full h-fit mb-2 rounded-md border-[1px] bg-slate-50 border-zinc-50 text-center">
                <div className="flex flex-row text-lg font-medium text-zinc-500">
                    All emphasis:
                    <RightWrongIcon isCorrect={hit_emphasis==="yes"}/>
                    Result:
                    <RightWrongIcon isCorrect={prediction==="pass"}/>
                </div>
            </div>
        </div>

  );
}