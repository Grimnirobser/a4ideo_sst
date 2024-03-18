"use client";

import VideoCard from "@/components/shared/VideoCard";
import { useQuery } from "@tanstack/react-query"
import  getSearchResults from "@/actions/getSearchResults";
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default function SearchPage({ searchParams }: PageProps) {

  const searchQuery  = searchParams.key as string;
  const {data: videos, isLoading} = useQuery({
    queryKey: ['searchVideo'],
    queryFn: async() => await getSearchResults({searchQuery}),
    staleTime: 1000 * 60 * 5,
  });


  if (isLoading) {
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
      <div className="w-4/5 mx-auto flex flex-col gap-4 items-center pb-4">
        {videos
          ? videos.map((video) => {
              return (
                <VideoCard
                  key={video.id}
                  isVertical={false}
                  video={video}
                  channel={video.channel}
                  includeDescription
                  channelAvatar
                />
              );
            })
          : "No videos found"}
      </div>
    );

  }
}
