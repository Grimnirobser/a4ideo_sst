import getCurrentChannel from "@/actions/getCurrentChannel";
import getVideosByChannelId from "@/actions/getVideosByChannelId";
import AnalyticsSummary from "@/components/studio/AnalyticsSummary";
import VideoDetailsCard from "@/components/studio/VideoDetailsCard";
import getProblemsetsByChannelId from "@/actions/getProblemsetsByChannelId";
import getAttemptsByChannelId from "@/actions/getAttemptsByChannelId";
import StudioContentSection from "@/components/studio/StudioContentSection";

export default async function StudioPage() {
  const currentChannel = await getCurrentChannel();
  const videos = await getVideosByChannelId({ channelId: currentChannel?.id });
  const problemsets = await getProblemsetsByChannelId({ channelId: currentChannel?.id });
  const attempts = await getAttemptsByChannelId({ channelId: currentChannel?.id });

  return (
    <div className="flex flex-col w-full h-full p-8">
      <AnalyticsSummary videos={videos} problemsets={problemsets} attempts={attempts}/>
      <StudioContentSection videos={videos} problemsets={problemsets} attempts={attempts}/>
    </div>
  );
}
