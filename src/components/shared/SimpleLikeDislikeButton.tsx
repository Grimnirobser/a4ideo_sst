"use client";
import {
  MdThumbUp,
  MdOutlineThumbUp,
  MdThumbDown,
  MdOutlineThumbDown,
} from "react-icons/md";
import { useState } from "react";
import { compactNumberFormat } from "@/lib/numUtils";
import { useToast } from "@/components/ui/use-toast"

interface SimpleLikeDislikeButtonProps {
    totalLike: number;
    totalDislike: number;
}

export const SimpleLikeDislikeButton = ({totalLike, totalDislike}: SimpleLikeDislikeButtonProps) => {
    const [liked, setLiked] = useState(false); 
    const [disliked, setDisliked] = useState(false);
    const { toast } = useToast()

  return (
    <div className="flex max-w-48 items-center gap-1 bg-gray-500 rounded-full px-3 py-2 text-white font-medium">
      <button
        className="pr-3 border-r-2 border-neutral-800 flex items-center gap-3"
        onClick={() => {
            if (liked){
                setLiked(false);
                toast({
                  variant: "flat",
                  description: "Undo like saved.",
                });
            }else{
                setLiked(true);
                setDisliked(false);
                toast({
                  variant: "flat",
                  description: "Like saved.",
                });
            }
        }}
      >
        {liked ? (
          <MdThumbUp className="h-6 w-6" />
        ) : (
          <MdOutlineThumbUp className="h-6 w-6" />
        )}
        <p>{compactNumberFormat(totalLike)}</p>
      </button>

      <button className="pl-2 flex items-center gap-3" onClick={() => {
            if (disliked){
                setDisliked(false);
                toast({
                  variant: "flat",
                  description: "Undo dislike saved.",
                });
            }else{
                setDisliked(true);
                setLiked(false);
                toast({
                  variant: "flat",
                  description: "Dislike saved.",
                });
            }
      }}>
        {disliked ? (
          <MdThumbDown className="h-6 w-6" />
        ) : (
          <MdOutlineThumbDown className="h-6 w-6" />
        )}
        <p>{compactNumberFormat(totalDislike)}</p>
      </button>
    </div>
  );
};
