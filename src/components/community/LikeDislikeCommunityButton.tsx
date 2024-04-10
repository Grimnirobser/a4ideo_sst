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
import { useQuery } from "@tanstack/react-query"
import checkChannelMembership from "@/actions/checkChannelMembership";
import { useContext } from "react";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";


interface LikeDislikeCommunityButtonProps {
  community: Community;
}

const LikeDislikeCommunityButton: React.FC<LikeDislikeCommunityButtonProps> = ({ community }) => {

  const currentChannel = useContext(CurrentChannelContext);


  const {data: isMember, isLoading} = useQuery({
    queryKey: ['checkChannelMembership', currentChannel?.id, community.id],
    queryFn: async() => await checkChannelMembership({communityId: community.id}),
  });

  const { likeDislikeCommunityStatus, toggleLikeDislikeCommunity } = useLikeDislikeCommunity({
    communityId: community.id,
  });

  return (
    <div className={`flex items-center gap-1 bg-neutral-800 rounded-full px-3 py-2 text-white font-medium w-fit ${!isMember || isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <button
        disabled={!isMember || isLoading}
        className="pr-3 border-r-2 border-neutral-600 flex items-center gap-3"
        onClick={() => toggleLikeDislikeCommunity("like")}
        title={`${!isMember || isLoading ? "only members can vote" : ""}`}
      >
        {likeDislikeCommunityStatus === LikeDislikeCommunityStatus.Liked ? (
          <MdThumbUp className={`h-6 w-6 ${!isMember || isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}/>
        ) : (
          <MdOutlineThumbUp className={`h-6 w-6 ${!isMember || isLoading ? "cursor-not-allowed" : "cursor-pointer"}`} />
        )}
        <p>{compactNumberFormat(community.likeCount)}</p>
      </button>
      <button 
        disabled={!isMember || isLoading}
        title={`${!isMember || isLoading ? "only members can vote" : ""}`}
        className="pl-2 flex items-center gap-3" onClick={() => toggleLikeDislikeCommunity("dislike")}>
        {likeDislikeCommunityStatus === LikeDislikeCommunityStatus.Disliked ? (
          <MdThumbDown className={`h-6 w-6 ${!isMember || isLoading ? "cursor-not-allowed" : "cursor-pointer"}`} />
        ) : (
          <MdOutlineThumbDown className={`h-6 w-6 ${!isMember || isLoading ? "cursor-not-allowed" : "cursor-pointer"}`} />
        )}
        <p>{compactNumberFormat(community.dislikeCount)}</p>
      </button>
    </div>
  );
};

export default LikeDislikeCommunityButton;
