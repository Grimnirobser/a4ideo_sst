import getTrendingVideos from "@/actions/getTrendingVideos";
import Poster from "@/components/shared/Poster";

export default async function Home() {
  const trendingVideos = await getTrendingVideos();

  return (
    <div className="mx-12 sm:mx-24 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {trendingVideos
        ? trendingVideos.map((trendingVideo) => {
            return (
              <Poster
                key={trendingVideo.id}
                video={trendingVideo}
                channel={trendingVideo.channel}
                channelAvatar
              />
            );
          })
        : "No videos found"}
    </div>
  );
}
