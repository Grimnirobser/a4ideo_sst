import { useRouter } from "next/navigation";
import { useCallback, useContext, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast"
import { CurrentChannelContext } from "@/context/CurrentChannelContext";

interface UseLikeDislikeCommunityProps {
  communityId: string;
}

export enum LikeDislikeCommunityStatus {
  Liked = 1,
  Disliked = 2,
  None = 3,
}

export const useLikeDislikeCommunity = ({ communityId }: UseLikeDislikeCommunityProps) => {

  const currentChannel = useContext(CurrentChannelContext);
  const router = useRouter();
  const { toast } = useToast();

  const likeDislikeCommunityStatus = useMemo(() => {
    if (!currentChannel || !communityId) return false;

    const likedCommunityIds = currentChannel.likedCommunityIds;
    const dislikedCommunityIds = currentChannel.dislikedCommunityIds;

    if (likedCommunityIds.includes(communityId)) {
      return LikeDislikeCommunityStatus.Liked;
    } else if (dislikedCommunityIds.includes(communityId)) {
      return LikeDislikeCommunityStatus.Disliked;
    } else {
      return LikeDislikeCommunityStatus.None;
    }
  }, [currentChannel, communityId]);



  const toggleLikeDislikeCommunity = useCallback(
    async (action: "like" | "dislike") => {
      if (!currentChannel) {
        alert("Please sign in to like/dislike. It is all free!");
        return;
      } else if (!communityId) return;

      try {
        if (action === "like") {
          switch (likeDislikeCommunityStatus) {
            case LikeDislikeCommunityStatus.Liked:
              await fetch(`/api/communities/${communityId}/like`, {
                method: "DELETE",
              });
              break;
            case LikeDislikeCommunityStatus.Disliked:
              await fetch(`/api/communities/${communityId}/dislike`, {
                method: "DELETE",
              }).then(() => fetch(`/api/communities/${communityId}/like`, {
                method: "POST",
              }));
              break;
            default:
              await fetch(`/api/communities/${communityId}/like`, {
                method: "POST",
              });
              break;
          }
        } else if (action === "dislike") {
          switch (likeDislikeCommunityStatus) {
            case LikeDislikeCommunityStatus.Liked:
              await fetch(`/api/communities/${communityId}/like`, {
                method: "DELETE",
              }).then(() => fetch(`/api/communities/${communityId}/dislike`, {
                method: "POST",
              }));
              break;
            case LikeDislikeCommunityStatus.Disliked:
              await fetch(`/api/communities/${communityId}/dislike`, {
                method: "DELETE",
              });
              break;
            default:
              await fetch(`/api/communities/${communityId}/dislike`, {
                method: "POST",
              });
              break;
          }
        }

        router.refresh();
        toast({
          variant: "success",
          title: "Success",
        });
      } catch (error) {
        toast({
          variant: "error",
          title: "Error",
          description: "Something went wrong, please try again.", 
         })
      }
    },
    [currentChannel, communityId, likeDislikeCommunityStatus, router, toast]
  );

  return {
    likeDislikeCommunityStatus,
    toggleLikeDislikeCommunity,
  };
};
