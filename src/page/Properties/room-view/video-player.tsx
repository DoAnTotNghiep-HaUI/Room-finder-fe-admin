import { URL_IMAGE } from "@/constants";
import React, { useState, useRef } from "react";
import { BiPause, BiPlay } from "react-icons/bi";
import { FaMaximize } from "react-icons/fa6";
import { LuVolume2, LuVolumeX } from "react-icons/lu";
interface VideoPlayerProps {
  id: string;
  filename_download: string;
  title: string;
}
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  id,
  filename_download,
  title,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };
  return (
    <div className="group relative">
      <video
        ref={videoRef}
        className="aspect-video w-full rounded-lg object-cover"
        // poster={poster}
        preload="metadata"
      >
        <source
          src={`${URL_IMAGE}/${id}/${filename_download}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      {/* Video Title */}
      <div className="absolute left-4 top-4 rounded-lg bg-black/60 px-3 py-1">
        <p className="text-sm font-medium text-white">{title}</p>
      </div>
      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="rounded-full p-2 transition-colors hover:bg-white/20"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <BiPause className="h-5 w-5" />
              ) : (
                <BiPlay className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="rounded-full p-2 transition-colors hover:bg-white/20"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <LuVolumeX className="h-5 w-5" />
              ) : (
                <LuVolume2 className="h-5 w-5" />
              )}
            </button>
          </div>
          <button
            onClick={toggleFullscreen}
            className="rounded-full p-2 transition-colors hover:bg-white/20"
            aria-label="Toggle fullscreen"
          >
            <FaMaximize className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
