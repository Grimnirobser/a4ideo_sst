import getTrendingCommunities from "@/actions/getTrendingCommunities";
import PosterForCommunity from "@/components/shared/PosterForCommunity";
import { notFound } from "next/navigation";

export default async function OriginFansPage() {
  const trendingCommunities = await getTrendingCommunities();

  return (
    <div className="mx-12 sm:mx-24 py-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {trendingCommunities
        ? trendingCommunities.map((trendingCommunity) => {
            return (
              <PosterForCommunity
                key={trendingCommunity.community.id}
                community={trendingCommunity.community}
                questions={trendingCommunity.questions}
              />
            );
          })
        : notFound()
      }
    </div>
  );
}
