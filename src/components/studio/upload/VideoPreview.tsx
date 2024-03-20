"use client";

import IconButton from "@/components/shared/IconButton";
import { useEffect, useState } from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import { useToast } from "@/components/ui/use-toast"

interface VideoPreviewProps {
  videoId: string;
  videoSrc: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoId, videoSrc }) => {
  const [videoLink, setVideoLink] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setVideoLink(`${window.location.host}/video/${videoId}`);
  }, [videoId]);

  const copyLink = () => {
    navigator.clipboard
      .writeText(videoLink)
      .then(() => toast({
        variant: "success",
        title: "Success",
        description: "Video added."})
      );
  };
  return (
    <div className="w-full md:w-2/5 flex flex-col overflow-hidden rounded-md">
      <iframe src={videoSrc} />
      <div className="bg-stone-900 p-4 flex justify-between items-center">
        <div className="w-4/5 truncate">
          <div className="text-sm text-zinc-400">Video link</div>
          <a href={videoSrc} className="text-sky-500">
            {videoLink}
          </a>
        </div>
        <IconButton onClick={copyLink}>
          <MdOutlineContentCopy className="cursor-pointer" />
        </IconButton>
      </div>
    </div>
  );
};

export default VideoPreview;
