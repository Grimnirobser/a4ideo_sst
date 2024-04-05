import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useCallback, useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import {
	RegExpMatcher,
	TextCensor,
	englishDataset,
	englishRecommendedTransformers,
  asteriskCensorStrategy
} from 'obscenity';
import { SignInOptionContext } from "@/context/SignInOptionContext";

interface UseCommentProps {
  videoId?: string | null;
}

export const useComment = ({ videoId }: UseCommentProps) => {
  const currentChannel = useContext(CurrentChannelContext);
  const SignInOption = useContext(SignInOptionContext);
  const router = useRouter();
  const { toast } = useToast();

  const [text, setText] = useState("");

  const submitComment = useCallback(async () => {
    if (!currentChannel) {
      SignInOption?.onOpen();
      return;
    }

    if (!videoId) return;
    const matcher = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers });
    const censor = new TextCensor().setStrategy(asteriskCensorStrategy());

    const matches = matcher.getAllMatches(text);
    const censoredText = censor.applyTo(text, matches)

    const data = {
      videoId,
      text: censoredText,
      channelId: currentChannel.id,
    };

    try {
      if (text.trim()) {
        await fetch(`/api/comments/${videoId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then(() => setText(""));
      }

      router.refresh();
      toast({
        variant: "success",
        title: "Success",
        description: "Comment successfully added.",
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Error",
        description: "Could not comment, please try again.", 
       })
    }
  }, [currentChannel, videoId, text, setText, router, toast, SignInOption]);

  return {
    text,
    setText,
    submitComment,
  };
};
