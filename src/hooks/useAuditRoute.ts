import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { CurrentUserContext } from "@/context/CurrentUserContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";



export const useAuditRoute = () => {
  
  const currentUser = useContext(CurrentUserContext);
  const currentChannel = useContext(CurrentChannelContext);

  const router = useRouter();

  useEffect(() => {
    if (!currentUser || !currentChannel || currentChannel) router.push("/");
  }, [checkChannel, currentChannel, currentUser, router]);
};