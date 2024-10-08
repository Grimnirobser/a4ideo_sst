"use client";

import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { Channel, Problemset } from "@prisma/client";
import { useContext } from "react";
import LikeDislikeProblemsetButton from "./LikeDislikeProblemsetButton";
import Link from "next/link";
import Avatar, { AvatarSize } from "@/components/shared/Avatar";
import { compactNumberFormat } from "@/lib/numUtils";
import Button from "@/components/shared/Button";
import SubscribeButton from "@/components/shared/SubscribeButton";

interface LikeSubscribeProblemsetSectionProps {
  channel: Channel;
  problemset: Problemset;
}

const LikeSubscribeProblemsetSection: React.FC<LikeSubscribeProblemsetSectionProps> = ({
  channel,
  problemset,
}) => {
  const currentChannel = useContext(CurrentChannelContext);

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <Link href={`/channel/${channel.username}`}>
          <Avatar size={AvatarSize.medium} imageSrc={channel.imageSrc} />
        </Link>

        <div className="flex flex-col justify-between mr-2">
          <Link href={`/channel/${channel.username}`}>
            <h2 className="text-lg">{channel.username}</h2>
          </Link>
          <p className="text-sm text-neutral-400">
            {compactNumberFormat(channel.subscriberCount)} subscribers
          </p>
        </div>
        
        {/* problemset section is too narrow to fit the button, remove for now */}
        {/* {channel.id === currentChannel?.id ? (
          <Link href="/studio">
            <Button type="rounded-dark">Manage videos</Button>
          </Link>
        ) : (
          <SubscribeButton channelId={channel.id} />
        )} */}
      </div>
      <LikeDislikeProblemsetButton problemset={problemset} />
    </div>
  );
};

export default LikeSubscribeProblemsetSection;
