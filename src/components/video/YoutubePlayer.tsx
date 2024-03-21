'use client'

import React from "react"
import Iframe from 'react-iframe'

interface VideoProps {
  youtubeId: string
}

const YoutubePlayer = ({ youtubeId }: VideoProps) => {

  return (
    <div className="relative w-full flex justify-center m-auto group bg-white">
      <Iframe
        className="w-full aspect-video z-[5] rounded-xl"
        url={`https://www.youtube.com/embed/${youtubeId}`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        ></Iframe>
    </div>
  );
};

export default YoutubePlayer