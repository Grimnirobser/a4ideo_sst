import getTrendingProblemsets from "@/actions/getTrendingProblemsets";
import HomePageProblemset from "@/components/shared/HomePageProblemset";

export default async function Home() {
  const trendingProblemsets = await getTrendingProblemsets();

  return (
    <div className="mx-10 sm:mx-20 py-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
      {trendingProblemsets
        ? trendingProblemsets.map((trendingProblemset) => {
            return (
              <HomePageProblemset
                key={trendingProblemset.id}
                problemset={trendingProblemset}
              />
            );
          })
        : "No problemsets found"}
    </div>
  );
}
