import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast"
import axios from "axios";

interface UseSubscribeProps {
  channelId: string;
}

export const useSubscribe = ({ channelId }: UseSubscribeProps) => {
  const currentChannel = useContext(CurrentChannelContext);
  const router = useRouter();
  const { toast } = useToast();

  const hasSubscribed = useMemo(() => {
    if (!currentChannel) return false;

    const subscriptions = currentChannel.subscribedChannelIds || [];

    return subscriptions.includes(channelId);
  }, [currentChannel, channelId]);

  const toggleSubscribed = useCallback(async () => {
    if (!currentChannel) {
      alert("Please sign in to subscribe. It is all free!");
      return;
    }

    try {
      if (hasSubscribed) {
        await axios.delete("/api/users/subscriptions", {
          data: {
            channelId,
          },
        });
      } else {
        await axios.post("/api/users/subscriptions", {
          channelId,
        });
      }

      router.refresh();

      toast({
        variant: "success",
        title: "Success",
        description: hasSubscribed ? "Unsubsscribed successfully" : "Subscribed successfully",
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Error",
        description: hasSubscribed ? "Could not unsubscribe" : "Could not subscribe",
       })
    }
  }, [currentChannel, channelId, hasSubscribed, router, toast]);

  return {
    hasSubscribed,
    toggleSubscribed,
  };
};
