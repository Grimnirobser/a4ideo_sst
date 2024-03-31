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

const YoutubePlayer = ({ youtubeId }: VideoProps) => {


  return (

    <div className="relative w-full flex justify-center m-auto group bg-white">
      <Iframe
        className="w-full z-[5] rounded-xl"
        url={`https://www.youtube.com/embed/${youtubeId}`}
        loading="lazy"
        onReady={(event) => setPlayer(event.target)}
        />
    </div>
  )

};

export default YoutubePlayer
