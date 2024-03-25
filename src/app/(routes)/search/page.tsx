"use client";

import { useQuery } from "@tanstack/react-query"
import  getSearchResults from "@/actions/getSearchResults";
import getTrendingVideos from "@/actions/getTrendingVideos";
import { Skeleton } from "@/components/ui/skeleton"
import Poster from "@/components/shared/Poster";


interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default function SearchPage({ searchParams }: PageProps) {

  const searchQuery  = searchParams.key as string;

  const {data: videosWithQuestions, isLoading: isLoadingSearch} = useQuery({
    queryKey: ['searchVideo', {searchQuery}],
    queryFn: async() => await getSearchResults({searchQuery}),
    staleTime: 1000 * 60 * 5,
  });

  const {data: trendingVideosWithQuestions, isLoading: isLoadingTrending} = useQuery({
    queryKey: ['trendingVideo'],
    queryFn: async() => await getTrendingVideos(),
    staleTime: 1000 * 60 * 5,
  });



  if (isLoadingSearch || isLoadingTrending) {
    return (
      <div className="w-4/5 mx-auto flex flex-col gap-4 items-center pb-4">
        <Skeleton className="h-4 w-full"/>
        <Skeleton className="h-4 w-full"/>
        <Skeleton className="h-4 w-full"/>
        <Skeleton className="h-4 w-full"/>
        <Skeleton className="h-4 w-full"/>
      </div>
    );
  }
  else{
    return (
      <div>
      <div className="mx-12 sm:mx-24 py-8 grid gap-4 grid-flow-col overflow-x-auto auto-cols-[20rem] no-scrollbar">
        {videosWithQuestions
            ? videosWithQuestions.map((videoWithQuestions) => {
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
            <div className="ml-8 text-lg italic antialiased font-mono">
              Others also looked for:
            </div>
      <div className="mx-12 sm:mx-24 py-8 grid gap-4 grid-flow-col overflow-x-auto auto-cols-[20rem] no-scrollbar">
        {trendingVideosWithQuestions
            ? trendingVideosWithQuestions.map((trendingVideoWithQuestions) => {
              return (
                <Poster
                  key={trendingVideoWithQuestions.video.id}
                  video={trendingVideoWithQuestions.video}
                  channel={trendingVideoWithQuestions.video.channel}
                  questions={trendingVideoWithQuestions.questions}
                  channelAvatar
                />
              );
            })
          : "No videos found"}
      </div>
      </div>
    );

  }
}
