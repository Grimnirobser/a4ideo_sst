'use client'

import { Community } from "@prisma/client";
import Link from "next/link";
import { compactNumberFormat } from "@/lib/numUtils";
import dayjs from "@/vendor/dayjs";
import ImageSlider from "./ImageSlider";
import { useState } from "react";

interface PosterProps {
  community: Community;
  questions: string[] | undefined | null;
  foot?: boolean;
}

interface SlideItem {
    isImage: boolean,
    source: string,
}


const PosterForCommunity: React.FC<PosterProps> = ({
  community,
  questions,
  foot = true,
}) => {

    const [activeIndex, setActiveIndex] = useState(0)
    const slides : SlideItem[] = community.imageSrcs.map((src) => ({isImage: true, source: src}));

    if (questions){
        questions.forEach((question) => {
            slides.push({isImage: false, source: question});
        });
    }

  return (
    <Link className="w-full" href={`/c/${community.name}`}>
      <div
        className="flex items-start flex-col gap-2 cursor-pointer overflow-hidden"
      >
        <div className="relative aspect-w-10 aspect-h-15 w-full">
            <ImageSlider slides={slides} activeIndex={activeIndex}  setActiveIndex={setActiveIndex}/>
        </div>

        {foot && (
        <div className="flex gap-2 items-start w-full">
          <div className="flex flex-col">
            <h3 className="line-clamp-2 text-md leading-5">
              {community.name}
            </h3>
            <div className="flex gap-2 items-center">
                <p className="text-neutral-400 text-sm whitespace-nowrap">
                {compactNumberFormat(community.memberCount)} members
                </p>
              </div>
            <p className="text-neutral-400 text-sm">
              {compactNumberFormat(community.likeCount + community.dislikeCount)} votes •{" "}
              {dayjs(community.createdAt).fromNow()}
            </p>
          </div>
        </div>)}

        
      </div>
    </Link>
  );
};

export default PosterForCommunity;
