import { useRef, useState, useEffect } from "react";
import { BsFillPlayFill, BsPause } from "react-icons/bs";

import { BiExitFullscreen, BiFullscreen } from "react-icons/bi";
import { MdVolumeOff, MdVolumeUp, MdVolumeDown } from "react-icons/md";
import Loading from "./Loading";
import moment from "moment";

export default function Player({ src, className, alt }) {
  const videoRef = useRef(null);
  const parentRef = useRef(null);
  const [hover, setHover] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localVolume, setLocalVolume] = useState(
    localStorage.getItem("volume")
  );
  const [volume, setVolume] = useState(localVolume ? localVolume : 1);
  const [showVolume, setShowVolume] = useState(1);
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
    setLocalVolume(localStorage.getItem("volume"));
  }, [localStorage.getItem("volume")]);

  useEffect(() => {
    localStorage.setItem("volume", volume);

    if (Number(volume) === 0) {
      setMuted(true);
    } else if (Number(volume) > 0) {
      setMuted(false);
    }

    if (muted) {
      videoRef.current.muted = true;
    } else if (!muted) {
      videoRef.current.muted = false;
    }
  }, [volume, muted]);

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
  }, [isPlaying, fullScreen, muted, volume]);

  return (
    <div
      ref={parentRef}
      className={`relative border border-borderColor ${className}`}
      onMouseMove={() => {
        setHover(true);
        if (hover === false) {
          setTimeout(() => {
            setHover(false);
          }, 3000);
        }
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      {!isPlaying && (
        <BsFillPlayFill
          onClick={resume}
          className="cursor-pointer absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16"
        />
      )}
      {loading && (
        <Loading
          className={
            "absolute inset-0 m-auto mt-1/2 w-16 h-16 border-6 border-black-30 border-t-white-100"
          }
        />
      )}
      {!hover && (
        <span className="absolute bottom-2 left-2 bg-black-70 px-1 py-0.5 rounded text-xs">
          {moment.utc((videoDuration - currentDuration) * 1000).format("mm:ss")}
        </span>
      )}
      {hover && (
        <div
          onMouseMove={() => {
            console.log("slm");
            setHover(true);
          }}
          className={controls}
        >
          <input
            type="range"
            min="0"
            step="0.1"
            max={videoDuration.toFixed(1)}
            value={currentDuration}
            onGotPointerCapture={() => {
              setIsPlaying(false);
            }}
            onLostPointerCapture={() => {
              setIsPlaying(true);
            }}
            onInput={(e) => {
              setCurrentDuration(e.target.value);
            }}
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
                {moment.utc(currentDuration * 1000).format("mm:ss")} /{" "}
                {moment.utc(videoDuration * 1000).format("mm:ss")}
              </p>
              <div className="relative ">
                {showVolume && (
                  <div
                    onMouseOver={handleHoverIn}
                    onMouseOut={handleHoverOut}
                    className="absolute bottom-4 pb-4 left-1/2 z-20"
                  >
                    <input
                      type="range"
                      min="0"
                      step={"0.1"}
                      onInput={(e) => setVolume(e.target.value)}
                      max="1"
                      value={Number(volume).toFixed(1)}
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
                  className={`${playerButton} py-2 z-30`}
                />
              ) : (
                <BiFullscreen
                  onClick={addFullScreen}
                  className={`${playerButton} py-2 z-30`}
                />
              )}
            </div>
          </div>
        </div>
      )}
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
  "w-full absolute z-10 bottom-2 px-2 flex flex-col justify-between";
const part = "w-full flex items-center";
const playerButton =
  "cursor-pointer w-10 h-10 hover:bg-white-10 rounded-full py-1 transition-colors";
const volumeClass = `${playerButton} py-2`;
const rangeClass =
  "cursor-pointer w-20 h-1 origin-top-left -rotate-90 bg-borderColor appearance-none rounded-full outline-none hover:border-0 accent-white-100";
