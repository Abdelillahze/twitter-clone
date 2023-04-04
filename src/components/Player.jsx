import { useRef, useState, useEffect } from "react";
import { BsFillPlayFill, BsPause } from "react-icons/bs";

import { BiExitFullscreen, BiFullscreen } from "react-icons/bi";
import { MdVolumeOff, MdVolumeUp, MdVolumeDown } from "react-icons/md";
import Loading from "./Loading";
import moment from "moment";

export default function Player({ src, className, alt }) {
  const videoRef = useRef(null);
  const parentRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const pause = () => {
    setIsPlaying(false);
  };

  const resume = () => {
    setIsPlaying(true);
  };

  const addFullScreen = () => {
    setFullScreen(true);
  };

  const removeFullScreen = () => {
    setFullScreen(false);
  };

  const mute = () => {
    setMuted(true);
    setVolume(0);
  };

  const unmute = () => {
    setMuted(false);
    setVolume(1);
  };

  const handleHoverIn = () => {
    setShowVolume(true);
  };

  const handleHoverOut = () => {
    setShowVolume(false);
  };

  useEffect(() => {
    if (!videoRef.current) return;
    if (!parentRef.current) return;

    videoRef.current.onended = () => {
      setIsPlaying(false);
    };

    videoRef.current.ondurationchange = () => {
      setVideoDuration(videoRef.current?.duration);
    };

    videoRef.current.onplaying = () => {
      setLoading(false);
    };

    videoRef.current.onwaiting = () => {
      if (isPlaying) {
        setLoading(true);
      }
    };

    videoRef.current.ontimeupdate = () => {
      setCurrentDuration(videoRef.current?.currentTime);
    };
    if (volume === 0) {
      setMuted(true);
    } else if (volume > 0) {
      setMuted(false);
    }

    videoRef.current.volume = volume;
    videoRef.current.currentTime = currentDuration;

    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    if (fullScreen) {
      if (!document.fullscreenElement) {
        if (parentRef.current.requestFullscreen) {
          parentRef.current.requestFullscreen();
        } else if (parentRef.current.mozRequestFullScreen) {
          parentRef.current.mozRequestFullScreen();
        } else if (parentRef.current.webkitRequestFullscreen) {
          parentRef.current.webkitRequestFullscreen();
        } else if (parentRef.current.msRequestFullscreen) {
          parentRef.current.msRequestFullscreen();
        }
      }
    } else if (!fullScreen) {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }

    if (muted) {
      videoRef.current.muted = true;
    } else if (!muted) {
      videoRef.current.muted = false;
    }
  }, [isPlaying, fullScreen, muted, volume]);

  return (
    <div
      ref={parentRef}
      className={`relative border border-borderColor ${className}`}
    >
      {loading && (
        <Loading
          className={
            "absolute inset-0 m-auto mt-1/2 w-16 h-16 border-6 border-black-30 border-t-white-100"
          }
        />
      )}
      <div className={controls}>
        <input
          type="range"
          min="0"
          step="0.1"
          max={videoDuration.toFixed(1)}
          value={currentDuration}
          onChange={(e) => setCurrentDuration(e.target.value)}
          className={`${rangeClass} player-bar rotate-0 w-full bg-white-50 mb-2`}
        />
        <div className={`${part} justify-between`}>
          <div className={part}>
            {isPlaying ? (
              <BsPause className={playerButton} onClick={pause} />
            ) : (
              <BsFillPlayFill className={playerButton} onClick={resume} />
            )}
          </div>
          <div className={`${part} justify-end`}>
            <p>
              {moment.utc(currentDuration * 1000).format("HH:mm:ss")} /{" "}
              {moment.utc(videoDuration * 1000).format("HH:mm:ss")}
            </p>
            <div className="relative ">
              {showVolume && (
                <div className="absolute bottom-8 left-1/2">
                  <input
                    onMouseOver={handleHoverIn}
                    onMouseOut={handleHoverOut}
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={(e) =>
                      setVolume(e.target.value === 0 ? 0 : e.target.value / 100)
                    }
                    className={rangeClass}
                  />
                </div>
              )}
              {muted ? (
                <MdVolumeOff
                  onMouseOver={handleHoverIn}
                  onMouseOut={handleHoverOut}
                  onClick={unmute}
                  className={volumeClass}
                />
              ) : volume >= 0.5 ? (
                <MdVolumeUp
                  onMouseOver={handleHoverIn}
                  onMouseOut={handleHoverOut}
                  onClick={mute}
                  className={volumeClass}
                />
              ) : (
                <MdVolumeDown
                  onMouseOver={handleHoverIn}
                  onMouseOut={handleHoverOut}
                  onClick={mute}
                  className={volumeClass}
                />
              )}
            </div>
            {fullScreen ? (
              <BiExitFullscreen
                onClick={removeFullScreen}
                className={`${playerButton} py-2`}
              />
            ) : (
              <BiFullscreen
                onClick={addFullScreen}
                className={`${playerButton} py-2`}
              />
            )}
          </div>
        </div>
      </div>
      <video
        onClick={() => setIsPlaying(!isPlaying)}
        ref={videoRef}
        src={src}
        alt={alt}
        className="w-full rounded cursor-pointer"
      ></video>
    </div>
  );
}

const controls =
  "w-full absolute z-20 bottom-2 px-2 flex flex-col justify-between";
const part = "w-full flex items-center";
const playerButton =
  "cursor-pointer w-10 h-10 hover:bg-white-10 rounded-full py-1 transition-colors";
const volumeClass = `${playerButton} py-2`;
const rangeClass =
  "cursor-pointer w-20 h-1  translate-y-1/2 origin-top-left -rotate-90 bg-borderColor appearance-none rounded-full outline-none hover:border-0 accent-white-100";
