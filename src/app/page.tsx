import getTrendingVideos from "@/actions/getTrendingVideos";
import Poster from "@/components/shared/Poster";

export default async function Home() {
  const trendingVideosWithQuestions = await getTrendingVideos();

  return (
    <div className="mx-12 sm:mx-24 py-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {trendingVideosWithQuestions
        ? trendingVideosWithQuestions.map((videoWithQuestions) => {
            return (
              <Poster
                key={videoWithQuestions.video.id}
                video={videoWithQuestions.video}
                channel={videoWithQuestions.video.channel}
                questions={videoWithQuestions.questions}
                channelAvatar
              />
            );
          })
        : "No videos found"}
    </div>
  );
}
