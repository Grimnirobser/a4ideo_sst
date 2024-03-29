"use client";

import { Video } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "@/vendor/dayjs";
import { compactNumberFormat } from "@/lib/numUtils";
import { MdDelete, MdEdit } from "react-icons/md";
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useMutation } from "@tanstack/react-query"
import checkVideoDeletable from "@/actions/checkVideoDeletable";

interface VideoDetailsCardProps {
  video: Video;
}

const VideoDetailsCard: React.FC<VideoDetailsCardProps> = ({ video }) => {
  
  const router = useRouter();
  const { toast } = useToast();

  const likeFraction = video.likeCount / (video.likeCount + video.dislikeCount);

  const {data: deletable, isLoading} = useQuery({
    queryKey: ['videoDeletable', video.id],
    queryFn: async() => await checkVideoDeletable({ videoId: video.id}),
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchInterval: 0,
  });

  
  //   TODO: Add edit description functionality
  // const handleEditDescription = useCallback(() => {
  //   if (confirm("Are you sure you want to delete this video?")) {
  //     axios
  //       .delete(`/api/videos/${video.id}`)
  //       .then(() => {
  //         toast.success("Video deleted");
  //         router.refresh();
  //       })
  //       .catch(() => toast.error("Video could not be deleted"));
  //   }
  // }, [video.id]);

  const handleDeleteVideo = useCallback(() => {
    if (confirm("Are you sure you want to delete this video?")) {
      fetch(`/api/videos/${video.id}`, {
        method: "DELETE",
      })
        .then(() => {
          toast({
            variant: "success",
            title: "Success",
            description: "Video successfully deleted.",
          });
          router.refresh();
        })
        .catch(() => toast({
          variant: "error",
          title: "Error",
          description: "We cannot delete this video.", 
         })
        );
    }
  }, [video.id, router, toast]);

  return (
    <div key={video.id}
    className="flex gap-6 justify-between items-center bg-slate-200 p-4 rounded-lg"
    >
      <Link href={`video/${video.id}`}>
        <Image
          unoptimized
          className="object-contain object-center"
          alt={`${video.title} thumbnail`}
          src={video.imageSrc}
          height={150}
          width={100}
        />
      </Link>

      <div className="w-2/5">
        <h3>{video.title}</h3>
        <p className="text-sm text-neutral-400 line-clamp-2">
          {video.description}
        </p>
      </div>

      <div className="flex flex-col">
        <p>{dayjs(video.updatedAt).format("MMM D, YYYY")}</p>
        <p className="text-sm text-neutral-400">
          {video.approved? "Published" : "Reviewing"}
        </p>
      </div>

      <div className="flex flex-col">
        <p>{compactNumberFormat(video.viewCount)}</p>
        <p className="text-sm text-neutral-400">Views</p>
      </div>

      <div className="flex flex-col">
        <p>{likeFraction ? `${likeFraction * 100} %` : "-"}</p>
        <p className="text-sm text-neutral-400">{video.likeCount} Likes</p>
      </div>

      
      {/* TODO: Add video status "approved | processing | disapproved | suspended" */}
      {/* <div className="flex flex-col">
        <p>{video.viewCount}</p>
      </div> */}

      <MdEdit
        className="h-6 w-6 cursor-pointer"
        onClick={() => { }}
      />

      <button onClick={handleDeleteVideo} disabled={!deletable || isLoading} title={`${(!deletable || isLoading) ? "contains problemset by someone else" : ""}`}>
        <MdDelete className={`h-6 w-6 ${deletable ? "cursor-pointer" : "cursor-not-allowed"}`}/>
      </button>
              

    </div>
  );
};

export default VideoDetailsCard;
