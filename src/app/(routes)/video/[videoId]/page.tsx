import getChannelById from "@/actions/getChannelById";
import getCommentsByVideoId from "@/actions/getCommentsByVideoId";
import increaseVideoViewCount from "@/actions/increaseVideoViewCount";
import CommentSection from "@/components/video/CommentSection/CommentSection";
import Description from "@/components/video/Description";
import LikeSubscribeSection from "@/components/video/LikeSubscribeSection/LikeSubscribeSection";
import VideoPlayer from "@/components/video/VideoPlayer";
import YoutubePlayer from "@/components/video/YoutubePlayer";
import getProblemsetsByVideoId from "@/actions/getProblemsetsByVideoId";
import ProblemsetSection from "@/components/video/ProblemsetSection/ProblemsetSection";
import { initAction } from "@/actions/submitAttempt";


interface VideoPageParams {
  videoId?: string;
}

export default async function VideoPage({
  params,
}: {
  params: VideoPageParams;
}) {
  await initAction();   // dirty work related to next.js issue due to unstable server action https://github.com/vercel/next.js/issues/54282
  const { videoId } = params;
  const problemsets = await getProblemsetsByVideoId({ videoId });
  const video = await increaseVideoViewCount({ videoId });
  const channel = await getChannelById({ channelId: video?.channelId });
  const comments = await getCommentsByVideoId({ videoId,});

  return video && channel && comments ? (
    <div className="flex flex-col lg:flex-row mx-6 mt-2 gap-4">
      <div className="w-full lg:w-4/6 flex flex-col gap-4 overflow-y-auto max-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* <VideoPlayer videoSrc={video.videoSrc} /> */}
        <YoutubePlayer youtubeId={video.youtubeId}/>
        <h1 className="text-2xl font-medium break-all">{video.title}</h1>
        <LikeSubscribeSection video={video} channel={channel} />
        <Description video={video} />
        <CommentSection comments={comments} videoId={video.id} />
      </div>

      <div className="w-full lg:w-2/6 max-h-screen">
        <ProblemsetSection problemsets={problemsets!} videoId={video.id} />
      </div>
      
    </div>
  ) : (
    <h1>Video not found</h1>
  );
}