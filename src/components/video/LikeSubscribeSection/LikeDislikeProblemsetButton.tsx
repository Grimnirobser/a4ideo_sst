"use client";

import { LikeDislikeProblemsetStatus, useLikeDislikeProblemset } from "@/hooks/useLikeDislikeProblemset";
import { compactNumberFormat } from "@/lib/numUtils";
import { Problemset } from "@prisma/client";
import {
  MdThumbUp,
  MdOutlineThumbUp,
  MdThumbDown,
  MdOutlineThumbDown,
} from "react-icons/md";

interface LikeDislikeProblemsetButtonProps {
  problemset: Problemset;
}

const LikeDislikeProblemsetButton: React.FC<LikeDislikeProblemsetButtonProps> = ({ problemset }) => {

  const { likeDislikeProblemsetStatus, toggleLikeDislikeProblemset } = useLikeDislikeProblemset({
    problemsetId: problemset.id,
  });

  return (
    <div className="flex items-center gap-1 bg-neutral-800 rounded-full px-3 py-2 text-white font-medium">
      <button
        className="pr-3 border-r-2 border-neutral-600 flex items-center gap-3"
        onClick={() => toggleLikeDislikeProblemset("like")}
      >
        {likeDislikeProblemsetStatus === LikeDislikeProblemsetStatus.Liked ? (
          <MdThumbUp className="h-6 w-6" />
        ) : (
          <MdOutlineThumbUp className="h-6 w-6" />
        )}
        <p>{compactNumberFormat(problemset.likeCount)}</p>
      </button>
      <button className="pl-2" onClick={() => toggleLikeDislikeProblemset("dislike")}>
        {likeDislikeProblemsetStatus === LikeDislikeProblemsetStatus.Disliked ? (
          <MdThumbDown className="h-6 w-6" />
        ) : (
          <MdOutlineThumbDown className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default LikeDislikeProblemsetButton;
