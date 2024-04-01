import getChannelById from "@/actions/getChannelById";
import getCommentsByVideoId from "@/actions/getCommentsByVideoId";
import increaseVideoViewCount from "@/actions/increaseVideoViewCount";
import getProblemsetsByVideoId from "@/actions/getProblemsetsByVideoId";
import { notFound } from 'next/navigation';
import { VideoComponentsWrapper } from "@/components/video/VideoComponentsWrapper";


interface VideoPageParams {
  videoId?: string;
}

export default async function VideoPage({
  params,
}: {
  params: VideoPageParams;
}) {
  const { videoId } = params;
  const problemsets = await getProblemsetsByVideoId({ videoId });
  const video = await increaseVideoViewCount({ videoId });
  const channel = await getChannelById({ channelId: video?.channelId });
  const comments = await getCommentsByVideoId({ videoId });

  return video && channel && comments ? (
      <VideoComponentsWrapper video={video} channel={channel} comments={comments} problemsets={problemsets!}/>
  ) : (
    notFound()
  );
}