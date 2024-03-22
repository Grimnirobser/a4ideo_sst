"use client";

import { Video } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "@/vendor/dayjs";
import { compactNumberFormat } from "@/lib/numUtils";
import { MdDelete, MdEdit } from "react-icons/md";
import { useCallback } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"

interface VideoDetailsCardProps {
  video: Video;
}

const VideoDetailsCard: React.FC<VideoDetailsCardProps> = ({ video }) => {
  const router = useRouter();
  const { toast } = useToast();

  const likeFraction = video.likeCount / (video.likeCount + video.dislikeCount);

  
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
          description: "Something went wrong, please try again.", 
         })
        );
    }
  }, [video.id, router, toast]);

  return (
    <div
      key={video.id}
      className="flex gap-6 justify-between items-center bg-slate-200 p-4 rounded-lg"
    >
      <Link href={`video/${video.id}`}>
        <Image
          unoptimized
          className="aspect-video"
          alt={`${video.title} thumbnail`}
          src={video.thumbnailSrc}
          height={90}
          width={160}
        />
      </Link>

      <div className="w-2/5">
        <h3>{video.title}</h3>
        <p className="text-sm text-neutral-400 line-clamp-2">
          {video.description}
        </p>
      </div>

      {/* TODO: change video.createdAt to video.updatedAt */}

      <div className="flex flex-col">
        <p>{dayjs(video.createdAt).format("MMM D, YYYY")}</p>
        <p className="text-sm text-neutral-400">Published</p>
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

      <MdDelete
        className="h-6 w-6 cursor-pointer"
        onClick={handleDeleteVideo}
      />
    </div>
  );
};

export default VideoDetailsCard;
