import { AppState } from "@/redux";
import Hls from "hls.js";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function PreviewVideo({ src, preview }: { src: string; preview: string }) {
  const { accessToken } = useSelector((state: AppState) => state.auth);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>("");
  useEffect(() => {
    fetch(src, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch the video");
        }
        return response.blob();
      })
      .then((blob) => {
        setVideoSrc(URL.createObjectURL(blob));
      })
      .catch((error) => {
        console.error("Error fetching video:", error);
        setVideoSrc(null);
      });
  }, [src]);
  // useEffect(() => {
  //   if (src && typeof src === "string") {
  //     if (Hls.isSupported()) {
  //       const hls = new Hls();
  //       hls.loadSource(src);
  //       if (videoRef.current) {
  //         hls.attachMedia(videoRef.current);
  //       }
  //       return () => {
  //         hls.destroy();
  //       };
  //     } else if (
  //       videoRef.current &&
  //       videoRef.current.canPlayType("application/vnd.apple.mpegurl")
  //     ) {
  //       videoRef.current.src = src;
  //     }
  //   } else if (preview) {
  //     setVideoSrc(preview);
  //   }
  // }, [src, preview]);

  return (
    <video
      className="absolute top-0 left-0 w-full h-full object-cover"
      src={videoSrc}
      controls
      ref={videoRef}
    />
  );
}

export default PreviewVideo;
