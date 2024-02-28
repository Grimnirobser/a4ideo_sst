import { useRouter } from "next/navigation";
import { useCallback, useContext, useMemo } from "react";
import { toast } from "react-hot-toast";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";


import axios from "axios";

interface UseLikeDislikeProps {
  videoId: string;
}

export enum LikeDislikeStatus {
  Liked = 1,
  Disliked = 2,
  None = 3,
}

export const useLikeDislike = ({ videoId }: UseLikeDislikeProps) => {

  const currentChannel = useContext(CurrentChannelContext);


  const router = useRouter();

  const likeDislikeStatus = useMemo(() => {
    if (!currentChannel || !videoId) return false;

    const likedVideoIds = currentChannel.likedVideoIds;
    const dislikedVideoIds = currentChannel.dislikedVideoIds;

    if (likedVideoIds.includes(videoId)) {
      return LikeDislikeStatus.Liked;
    } else if (dislikedVideoIds.includes(videoId)) {
      return LikeDislikeStatus.Disliked;
    } else {
      return LikeDislikeStatus.None;
    }
  }, [currentChannel, videoId]);


  
  const toggleLikeDislike = useCallback(
    async (action: "like" | "dislike") => {
      if (!currentChannel) {
        alert("Please sign in to like/dislike");
        return;
      } else if (!videoId) return;

      try {
        if (action === "like") {
          switch (likeDislikeStatus) {
            case LikeDislikeStatus.Liked:
              await axios.delete(`/api/videos/${videoId}/like`);
              break;
            case LikeDislikeStatus.Disliked:
              await axios
                .delete(`/api/videos/${videoId}/dislike`)
                .then(() => axios.post(`/api/videos/${videoId}/like`));
              break;
            default:
              await axios.post(`/api/videos/${videoId}/like`);
              break;
          }
        } else if (action === "dislike") {
          switch (likeDislikeStatus) {
            case LikeDislikeStatus.Liked:
              await axios
                .delete(`/api/videos/${videoId}/like`)
                .then(() => axios.post(`/api/videos/${videoId}/dislike`));
              break;
            case LikeDislikeStatus.Disliked:
              await axios.delete(`/api/videos/${videoId}/dislike`);
              break;
            default:
              await axios.post(`/api/videos/${videoId}/dislike`);
              break;
          }
        }

        router.refresh();
        toast.success("Success!");
      } catch (error) {
        toast.error("There was an error");
      }
    },
    [currentChannel, videoId, likeDislikeStatus, router]
  );

  return {
    likeDislikeStatus,
    toggleLikeDislike,
  };
};
