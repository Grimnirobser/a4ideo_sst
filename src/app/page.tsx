import getTrendingProblemsets from "@/actions/getTrendingProblemsets";
import HomePageProblemset from "@/components/shared/HomePageProblemset";
import FirstPageBanner from "@/components/shared/FirstPageBanner";

export default async function Home() {
  const trendingProblemsets = await getTrendingProblemsets();

  return (
    <>
    <FirstPageBanner bgColor="red"/>
    <div className="mx-10 sm:mx-20 text-4xl flex flex-col gap-6">
      <p><a className="underline decoration-double decoration-rose-500">Watch</a>{' '} & {' '}<a className="underline decoration-double decoration-green-500">Task</a>{' '}&{' '}<a className="underline decoration-double decoration-sky-500">Feedback</a></p>

    </div>
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
  </>
  );
}
