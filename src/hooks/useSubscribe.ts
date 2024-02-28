import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useMemo } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

interface UseSubscribeProps {
  channelId: string;
}

export const useSubscribe = ({ channelId }: UseSubscribeProps) => {
  const currentChannel = useContext(CurrentChannelContext);


  const router = useRouter();

  const hasSubscribed = useMemo(() => {
    if (!currentChannel) return false;

    const subscriptions = currentChannel.subscribedChannelIds || [];

    return subscriptions.includes(channelId);
  }, [currentChannel, channelId]);

  const toggleSubscribed = useCallback(async () => {
    if (!currentChannel) {
      alert("Please sign in to subscribe");
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
      toast.success(
        hasSubscribed ? "Unsubsscribed successfully" : "Subscribed successfully"
      );
    } catch (error) {
      toast.error(
        hasSubscribed ? "Could not unsubscribe" : "Could not subscribe"
      );
    }
  }, [currentChannel, channelId, hasSubscribed, router]);

  return {
    hasSubscribed,
    toggleSubscribed,
  };
};
