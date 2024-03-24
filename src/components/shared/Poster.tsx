'use client'

import { Channel, Video } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Avatar, { AvatarSize } from "./Avatar";
import { compactNumberFormat } from "@/lib/numUtils";
import dayjs from "@/vendor/dayjs";
import ImageSlider from "./ImageSlider";
import { useState } from "react";

interface PosterProps {
  channel?: Channel;
  channelAvatar?: boolean;
  video: Video;
  includeDescription?: boolean;
  questions: string[];
}

interface SlideItem {
    isImage: boolean,
    source: string,
}


const Poster: React.FC<PosterProps> = ({
  channel,
  channelAvatar = true,
  video,
  questions,
}) => {

    const [activeIndex, setActiveIndex] = useState(0)
    const slides : SlideItem[] = [];
    slides.push({isImage: true, source: video.thumbnailSrc});

    questions.forEach((question) => {
        slides.push({isImage: false, source: question});
    });
  return (
    <Link className="w-full" href={`/video/${video.id}${slides[activeIndex].isImage ? "" : `?ps=${activeIndex}`}`}>
      <div
        className="flex items-start flex-col gap-2 cursor-pointer overflow-hidden"
      >
        <div className="relative aspect-w-10 aspect-h-15 w-full">
            <ImageSlider slides={slides} activeIndex={activeIndex}  setActiveIndex={setActiveIndex}/>
        </div>
        <div className="flex gap-2 items-start w-full">
          {channel && channelAvatar ? (
            <Avatar className="mt-1" imageSrc={channel.imageSrc} />
          ) : null}
          <div className="flex flex-col">
            <h3 className="line-clamp-2 text-md leading-5">
              {video.title}
            </h3>
            {channel ? (
              <div className="flex gap-2 items-center">
                <p className="text-neutral-400 text-sm whitespace-nowrap">
                  {channel.username}
                </p>
              </div>
            ) : null}
            <p className="text-neutral-400 text-sm">
              {compactNumberFormat(video.viewCount)} views •{" "}
              {dayjs(video.createdAt).fromNow()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Poster;
