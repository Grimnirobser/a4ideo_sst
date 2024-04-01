"use client";

import { Problemset, Problem, Video } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "@/vendor/dayjs";
import { compactNumberFormat } from "@/lib/numUtils";
import { MdDelete, MdEdit } from "react-icons/md";
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useMutation } from "@tanstack/react-query"
import getVideoById from "@/actions/getVideoById";

interface ProblemsetDetailsCardProps {
  problemset: Problemset & {problems: Problem[]};
}

const ProblemsetDetailsCard: React.FC<ProblemsetDetailsCardProps> = ({ problemset }) => {
  const router = useRouter();
  const { toast } = useToast();

  const likeFraction = problemset.likeCount / (problemset.likeCount + problemset.dislikeCount);

  const {data: video, isLoading} = useQuery({
    queryKey: ['problemsetVideo', problemset.videoId],
    queryFn: async() => await getVideoById({ videoId: problemset.videoId}),
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchInterval: 0,
  });


  const handleDeleteProblemset = useCallback(() => {
    if (confirm("Are you sure you want to delete this problemset?")) {
      fetch(`/api/problemsets/${problemset.id}`, {
        method: "DELETE",
      })
        .then(() => {
          toast({
            variant: "success",
            title: "Success",
            description: "Problemset successfully deleted.",
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
  }, [problemset.id, router, toast]);


  if (!video) return null;

  const handleEditProblemset = () => {
      const encodedProblemsetId = encodeURIComponent(problemset.id);
      const encodedVideoId = encodeURIComponent(video.id);
      router.push(`/studio/edit-problemset?v=${encodedVideoId}&p=${encodedProblemsetId}`);
  };

  return (
    <div key={problemset.id}
    className="flex gap-6 justify-between items-center bg-slate-200 p-4 rounded-lg"
    >
      <Link href={`video/${video.id}`}>
        <Image
          unoptimized
          className="object-contain object-center"
          alt={`${video.title} thumbnail`}
          src={video!.imageSrc}
          height={150}
          width={100}
        />
      </Link>

      <div className="w-2/5">
        <h3 className="text-neutral-400 line-clamp-2">{video.title}</h3>
        {problemset.problems.map((problem, index) => (
            <p key={problem.id} className="text-base line-clamp-2">
                {index + 1}. {problem.question}
            </p>
        ))}
      </div>

      <div className="flex flex-col">
        <p>{dayjs(problemset.createdAt).format("MMM D, YYYY")}</p>
        <p className="text-sm text-neutral-400">
          {problemset.approved? "Published" : "Reviewing"}
        </p>
      </div>

      <div className="flex flex-col">
        <p>{likeFraction ? `${likeFraction * 100} %` : "-"}</p>
        <p className="text-sm text-neutral-400">{problemset.likeCount} Likes</p>
      </div>

        <button onClick={handleEditProblemset} disabled={isLoading}>
            <MdEdit className={"h-6 w-6 cursor-pointer"}/>
        </button>

        <button onClick={handleDeleteProblemset} disabled={video.problemsets.length <= 1 || isLoading} title={`${(video.problemsets.length <= 1 || isLoading) ? "cannot delete the only problemset" : ""}`}>
            <MdDelete className={`h-6 w-6 ${video.problemsets.length <= 1 ? "cursor-not-allowed" : "cursor-pointer"}`}/>
        </button>
    </div>
  );
};

export default ProblemsetDetailsCard;
