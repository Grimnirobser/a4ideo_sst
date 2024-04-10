import PosterForCommunity from "@/components/shared/PosterForCommunity";
import getTrendingCommunities from "@/actions/getTrendingCommunities";

export default async function CommunitiesPage() {
  const trendingCommunities = await getTrendingCommunities();

  return (
    <div className="mx-12 sm:mx-24 py-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {trendingCommunities
        ? trendingCommunities.map((community) => {
            return (
                <PosterForCommunity
                    key={community.id}
                    community={community}
                    questions={null}
                />
            );
          })
        : "No videos found"}
    </div>
  );
}
