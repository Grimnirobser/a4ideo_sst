'use client'

import React, { useState, useEffect, useRef } from "react"
import Iframe from 'react-iframe'

interface VideoProps {
  youtubeId: string
}

const YoutubePlayer = ({ youtubeId }: VideoProps) => {
  const [load, setLoad] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const currentVideo = videoRef.current;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoad(true);
        observer.disconnect();
      }
    });

    observer.observe(videoRef.current!);

    return () => {
      if (currentVideo) {
        observer.unobserve(currentVideo);
      }
    };
  }, []);

  return (
    <div ref={videoRef}>
          {load ? (
        <div className="relative w-full flex justify-center m-auto group bg-white">
          <Iframe
            className="w-full aspect-video z-[5] rounded-xl"
            url={`https://www.youtube.com/embed/${youtubeId}`}
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            ></Iframe>
        </div>
      ) : (
        <div>Loading...</div>
      )}
        
    </div>
  );
};

export default YoutubePlayer