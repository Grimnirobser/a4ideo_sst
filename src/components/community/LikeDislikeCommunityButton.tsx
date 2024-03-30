"use client";

import { LikeDislikeCommunityStatus, useLikeDislikeCommunity } from "@/hooks/useLikeDislikeCommunity";
import { compactNumberFormat } from "@/lib/numUtils";
import { Community } from "@prisma/client";
import {
  MdThumbUp,
  MdOutlineThumbUp,
  MdThumbDown,
  MdOutlineThumbDown,
} from "react-icons/md";

interface LikeDislikeCommunityButtonProps {
  community: Community;
}

const LikeDislikeCommunityButton: React.FC<LikeDislikeCommunityButtonProps> = ({ community }) => {

  const { likeDislikeCommunityStatus, toggleLikeDislikeCommunity } = useLikeDislikeCommunity({
    communityId: community.id,
  });

  return (
    <div className="flex items-center gap-1 bg-neutral-800 rounded-full px-3 py-2 text-white font-medium">
      <button
        className="pr-3 border-r-2 border-neutral-600 flex items-center gap-3"
        onClick={() => toggleLikeDislikeCommunity("like")}
      >
        {likeDislikeCommunityStatus === LikeDislikeCommunityStatus.Liked ? (
          <MdThumbUp className="h-6 w-6" />
        ) : (
          <MdOutlineThumbUp className="h-6 w-6" />
        )}
        <p>{compactNumberFormat(community.likeCount)}</p>
      </button>
      <button className="pl-2" onClick={() => toggleLikeDislikeCommunity("dislike")}>
        {likeDislikeCommunityStatus === LikeDislikeCommunityStatus.Disliked ? (
          <MdThumbDown className="h-6 w-6" />
        ) : (
          <MdOutlineThumbDown className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default LikeDislikeCommunityButton;
