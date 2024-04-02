"use client";

import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Video, Problemset, Attempt, Problem } from "@prisma/client";
import { useContext, useMemo } from "react";
import Avatar, { AvatarSize } from "../shared/Avatar";
import { compactNumberFormat, safeRoundOneDecimalDivider } from "@/lib/numUtils";
import VideoDetailsCard from "@/components/studio/VideoDetailsCard";
import { useState } from "react";
import ProblemsetDetailsCard from "@/components/studio/ProblemsetDetailsCard";
import { useSearchParams } from "next/navigation";


interface StudioContentSectionProps {
    videos: Video[];
    problemsets: (Problemset & {problems: Problem[]})[];
    attempts: Attempt[];
}


const StudioContentSection: React.FC<StudioContentSectionProps> = ({ 
    videos,
    problemsets, 
    attempts,
}) => {
    const searchParams = useSearchParams();
    const chooseProblemset = searchParams.get('p');
    const [chooseVideo, setChooseVideo] = useState(chooseProblemset === '1' ? false : true);

    return (
        <div className="flex flex-col gap-4 mt-8">
            <div className="flex flex-row gap-10">
                <h2 className={`text-2xl cursor-pointer ${chooseVideo ? "underline underline-offset-4" : null}`} onClick={()=>setChooseVideo(true)}>Videos</h2>
                <h2 className={`text-2xl cursor-pointer ${chooseVideo ? null : "underline underline-offset-4"}`} onClick={()=>setChooseVideo(false)}>Problemsets</h2>
            </div>

            {chooseVideo ? 
            (videos.length ? videos.map((video) => {return <VideoDetailsCard key={video.id} video={video} />;}): "Upload some videos to get started") 
            : (problemsets.length ? problemsets.map((problemset) => {return <ProblemsetDetailsCard key={problemset.id} problemset={problemset} />;}): "Create some problemsets to get started")}
      </div>
    )

}


export default StudioContentSection;







