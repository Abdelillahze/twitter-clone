import { useRef, useState, useEffect } from "react";
import { BsImage, BsEmojiSmile } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import Picker from "@emoji-mart/react";
import Loading from "./Loading";

export default function Maker({
  handler,
  user,
  buttonName,
  upload,
  className,
  info,
  Emojis,
}) {
  const inputFileRef = useRef(null);
  const [data, setData] = useState({
    input: info && info.text ? info.text : "",
    selectedImageFile: info && info.image ? info.image : null,
    selectedImage: info && info.image ? info.image : null,
    selectedVideoFile: info && info.video ? info.video : null,
    selectedVideo: info && info.video ? info.video : null,
    showEmojis: false,
  });
  const tagRegex = /<@(?<username>[^<@>]+)>/gm;

  useEffect(() => {
    if (upload) {
      setData({
        input: "",
        selectedImageFile: null,
        selectedImage: null,
        selectedVideoFile: null,
        selectedVideo: null,
        showEmojis: false,
      });
    }
  }, [upload]);

  if (upload) {
    return (
      <div className="flex items-center justify-center px-4 py-4 border border-transparent border-b-borderColor">
        <Loading />
      </div>
    );
  }

  const addEmoji = (e) => {
    const emoji = e.native;
    setData((data) => ({ ...data, input: data.input + emoji }));
  };

  return (
    <div
      className={`maker flex px-4 py-4 border border-transparent border-b-borderColor ${className}`}
    >
      <Image
        className="w-12 h-12 rounded-full mr-4"
        src={user.image}
        alt={"pfp"}
        width="100"
        height="100"
      />
      <div className="w-full flex flex-col mb-2">
        <div className="border border-transparent border-b-borderColor py-2 mb-2">
          <textarea
            className="tweet-input outline-none bg-transparent w-full  mb-2"
            type="text"
            value={data.input}
            onChange={(e) =>
              setData((data) => ({ ...data, input: e.target.value }))
            }
            placeholder="What's Happening ?"
          />
          {data.selectedImage && (
            <div className="relative">
              <Image
                className="w-full h-fit rounded"
                src={data.selectedImage}
                alt={"image"}
                width="1000"
                height="1000"
              />
              <IoMdClose
                onClick={() => {
                  setData((data) => ({
                    ...data,
                    selectedImageFile: null,
                    selectedImage: null,
                  }));
                }}
                className="absolute top-2 left-2 w-8 h-8 px-2 py-2 bg-p rounded-full cursor-pointer transition-opacity hover:opacity-90"
              />
            </div>
          )}
          {data.selectedVideo && (
            <div className="relative">
              <video
                controls
                className="w-full h-fit rounded"
                src={data.selectedVideo}
                alt={"video"}
              />
              <IoMdClose
                onClick={() => {
                  setData((data) => ({
                    ...data,
                    selectedFileVideo: null,
                    selectedVideo: null,
                  }));
                }}
                className="absolute top-2 left-2 w-8 h-8 px-2 py-2 bg-p rounded-full cursor-pointer transition-opacity hover:opacity-90"
              />
            </div>
          )}
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="flex text-blue-100">
            <div className="w-8 h-8 px-2 py-2 rounded-full hover:bg-blue-10">
              <input
                ref={inputFileRef}
                onChange={(e) => {
                  if (e.target.files) {
                    const file = e.target.files[0];
                    if (file?.type.includes("image")) {
                      setData((data) => ({
                        ...data,
                        selectedImage: URL.createObjectURL(file),
                        selectedImageFile: file,
                      }));
                    } else if (file.type.includes("video")) {
                      setData((data) => ({
                        ...data,
                        selectedVideo: URL.createObjectURL(file),
                        selectedVideoFile: file,
                      }));
                    }
                  }
                }}
                type="file"
                className="hidden"
              />
              <BsImage
                onClick={() => inputFileRef.current.click()}
                className="mr-2 cursor-pointer "
              />
            </div>
            <div className="relative w-8 h-8 px-2 py-2 rounded-full hover:bg-blue-10">
              <BsEmojiSmile
                onClick={() =>
                  setData((data) => ({ ...data, showEmojis: !data.showEmojis }))
                }
                className="mr-2 cursor-pointer "
              />
              {data.showEmojis &&
                (Emojis ? (
                  <Picker data={Emojis} onEmojiSelect={addEmoji} />
                ) : (
                  <Loading className="absolute top-[100%]" />
                ))}
            </div>
          </div>

          <button
            onClick={() =>
              handler(
                data.input,
                data.selectedImageFile,
                data.selectedVideoFile
              )
            }
            disabled={!data.input.trim()}
            className="text-white bg-blue-100 px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-default"
          >
            {buttonName}
          </button>
        </div>
      </div>
    </div>
  );
}
