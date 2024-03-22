"use client";

import { compactNumberFormat } from "@/lib/numUtils";
import { Video } from "@prisma/client";
import { useState } from "react";
import dayjs from "@/vendor/dayjs";
import { cn } from "@/lib/utils"


interface DescriptionProps {
  video: Video;
}

const Description: React.FC<DescriptionProps> = ({ video }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`bg-gray-100	 rounded-xl p-3 overflow-hidden${
        isExpanded ? "h-fit" : "line-clamp-2 max-h-28"
      }`}
    >
      <div className="flex gap-2 text-black font-medium">
        <p>{compactNumberFormat(video.viewCount)} views</p>
        <p>{dayjs(video.createdAt).format("MMM D, YYYY")}</p>
      </div>
      <div className={isExpanded ? "" : "line-clamp-2"}>
        <div className="whitespace-pre-line">
          {video.description.split("\n").map((line, index) => {
            return line === "" ? <br key={index} /> : <p key={index}>{line}</p>;
          })}
        </div>
      </div>
      <p
        onClick={() => {
          setIsExpanded((isExpanded) => !isExpanded);
        }}
        className={`cursor-pointer ${isExpanded ? "mt-2" : ""}`}
      >
        {isExpanded ? "Show less" : "...more"}
      </p>
    </div>
  );
};

export default Description;
