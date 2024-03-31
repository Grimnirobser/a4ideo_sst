'use client';

import CommentSection from "@/components/video/CommentSection/CommentSection";
import Description from "@/components/video/Description";
import LikeSubscribeSection from "@/components/video/LikeSubscribeSection/LikeSubscribeSection";
import YoutubePlayer from "@/components/video/YoutubePlayer";
import ProblemsetSection from "@/components/video/ProblemsetSection/ProblemsetSection";
import { DocView } from "@/components/video/DocView";
import { Video, Channel, Problemset, Problem, Comment } from "@prisma/client";
import { useState } from "react";


interface VideoComponentsWrapperParams {
    video: Video;
    channel: Channel;
    comments: (Comment & { channel: Channel })[];
    problemsets: (Problemset & { channel: Channel, problems: Problem[] })[];
}

// have to do this, wrap all the video components in a single client component
// so problemset section and video player section can communicate
export const VideoComponentsWrapper = ({
    video, 
    channel,
    comments, 
    problemsets, 
}: VideoComponentsWrapperParams) => {

    const [problemTime, setProblemTime] = useState<number>(-1);

    return (
        <div className="flex flex-col lg:flex-row mx-6 mt-2 gap-4">
            <div className="w-full lg:w-4/6 flex flex-col gap-4 overflow-y-auto max-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* <VideoPlayer videoSrc={video.videoSrc} /> */}
                {video.youtubeId === "" ? <DocView imageSrc={video.imageSrc}/> : <YoutubePlayer youtubeId={video.youtubeId} problemTime={problemTime} setProblemTime={setProblemTime}/>}
                <h1 className="text-2xl font-medium break-words hyphens-auto">{video.title}</h1>
                <LikeSubscribeSection video={video} channel={channel} />
                <Description video={video} />
                <CommentSection comments={comments} videoId={video.id} />
            </div>

            <div className="w-full lg:w-2/6 max-h-screen overflow-y-auto no-scrollbar">
                <ProblemsetSection problemsets={problemsets!} videoId={video.id} setProblemTime={setProblemTime}/>
            </div>
            
        </div>
  )

}