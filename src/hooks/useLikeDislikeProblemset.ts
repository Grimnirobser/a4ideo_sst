import { useRouter } from "next/navigation";
import { useCallback, useContext, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast"
import { CurrentChannelContext } from "@/context/CurrentChannelContext";

interface UseLikeDislikeProblemsetProps {
  problemsetId: string;
}

export enum LikeDislikeProblemsetStatus {
  Liked = 1,
  Disliked = 2,
  None = 3,
}

export const useLikeDislikeProblemset = ({ problemsetId }: UseLikeDislikeProblemsetProps) => {

  const currentChannel = useContext(CurrentChannelContext);
  const router = useRouter();
  const { toast } = useToast();

  const likeDislikeProblemsetStatus = useMemo(() => {
    if (!currentChannel || !problemsetId) return false;

    const likedProblemsetIds = currentChannel.likedProblemsetIds;
    const dislikedProblemsetIds = currentChannel.dislikedProblemsetIds;

    if (likedProblemsetIds.includes(problemsetId)) {
      return LikeDislikeProblemsetStatus.Liked;
    } else if (dislikedProblemsetIds.includes(problemsetId)) {
      return LikeDislikeProblemsetStatus.Disliked;
    } else {
      return LikeDislikeProblemsetStatus.None;
    }
  }, [currentChannel, problemsetId]);



  const toggleLikeDislikeProblemset = useCallback(
    async (action: "like" | "dislike") => {
      if (!currentChannel) {
        alert("Please sign in to like/dislike. It is all free!");
        return;
      } else if (!problemsetId) return;

      try {
        if (action === "like") {
          switch (likeDislikeProblemsetStatus) {
            case LikeDislikeProblemsetStatus.Liked:
              await fetch(`/api/problemsets/${problemsetId}/like`, {
                method: "DELETE",
              });
              break;
            case LikeDislikeProblemsetStatus.Disliked:
              await fetch(`/api/problemsets/${problemsetId}/dislike`, {
                method: "DELETE",
              }).then(() => fetch(`/api/problemsets/${problemsetId}/like`, {
                method: "POST",
              }));
              break;
            default:
              await fetch(`/api/problemsets/${problemsetId}/like`, {
                method: "POST",
              });
              break;
          }
        } else if (action === "dislike") {
          switch (likeDislikeProblemsetStatus) {
            case LikeDislikeProblemsetStatus.Liked:
              await fetch(`/api/problemsets/${problemsetId}/like`, {
                method: "DELETE",
              }).then(() => fetch(`/api/problemsets/${problemsetId}/dislike`, {
                method: "POST",
              }));
              break;
            case LikeDislikeProblemsetStatus.Disliked:
              await fetch(`/api/problemsets/${problemsetId}/dislike`, {
                method: "DELETE",
              });
              break;
            default:
              await fetch(`/api/problemsets/${problemsetId}/dislike`, {
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
    [currentChannel, problemsetId, likeDislikeProblemsetStatus, router, toast]
  );

  return {
    likeDislikeProblemsetStatus,
    toggleLikeDislikeProblemset,
  };
};
