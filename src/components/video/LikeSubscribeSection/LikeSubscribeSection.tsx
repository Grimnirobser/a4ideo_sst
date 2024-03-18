"use client";

import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { Channel, Video } from "@prisma/client";
import { useContext } from "react";
import LikeDislikeButton from "./LikeDislikeButton";
import Link from "next/link";
import Avatar, { AvatarSize } from "@/components/shared/Avatar";
import { compactNumberFormat } from "@/utils/numUtils";
import Button from "@/components/shared/Button";
import SubscribeButton from "@/components/shared/SubscribeButton";

interface LikeSubscribeSectionProps {
  channel: Channel;
  video: Video;
}

const LikeSubscribeSection: React.FC<LikeSubscribeSectionProps> = ({
  video,
  channel,
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
        {channel.id === currentChannel?.id ? (
          <Link href="/studio">
            <Button type="rounded-dark">Manage videos</Button>
          </Link>
        ) : (
          <SubscribeButton channelId={channel.id} />
        )}
      </div>
      <LikeDislikeButton video={video} />
    </div>
  );
};

export default LikeSubscribeSection;
