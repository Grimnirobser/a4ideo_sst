'use client'

import Iframe from 'react-iframe'
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';
import { use, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast"


interface VideoProps {
  youtubeId: string,
  problemTime: number, 
  setProblemTime: (time: number) => void
}

const YoutubePlayer = ({ youtubeId, problemTime, setProblemTime }: VideoProps) => {
  const [player, setPlayer] = useState<YouTubePlayer>();
  const { toast } = useToast()


  useEffect(() => {
    if (player && problemTime !== -1){
      if (player.getDuration() <= 0){
          toast({
            variant: "error",
            title: "Error",
            description: "Video is not ready yet.",
          });
      }else if(player.getDuration() <= problemTime){
          toast({
            variant: "error",
            title: "Error",
            description: "Invalid time. Please contact dev@a4ideo.com.",
          });
      }else{
        player.seekTo(problemTime, true)
      }

      if (player.getCurrentTime() !== problemTime){
        setProblemTime(-1);
      }
    }
  }, [player, problemTime, setProblemTime, toast]);

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
        autoplay: 1,
    },
  };

  return (
    // <div className="relative w-full aspect-w-16 aspect-h-9 flex justify-center m-auto group bg-white">
    //   <Iframe
    //     className="w-full z-[5] rounded-xl"
    //     url={`https://www.youtube.com/embed/${youtubeId}`}
    //     loading="lazy"
    //     allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    //     ></Iframe>
    // </div>

    <div className="relative w-full aspect-w-16 aspect-h-9 flex justify-center m-auto group bg-white"> 
      <YouTube 
        id = "youtube-player"
        videoId={youtubeId} 
        opts={opts}
        iframeClassName="w-full z-[5] rounded-xl"
        loading="lazy"
        onReady={(event) => setPlayer(event.target)}
        />
    </div>
  )

};

export default YoutubePlayer
