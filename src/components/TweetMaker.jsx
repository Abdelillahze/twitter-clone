import Maker from "./Maker";
import axios from "axios";
import { useState } from "react";

export default function TweetMaker({ user, Emojis }) {
  const [upload, setUpload] = useState(false);
  const TweetHandler = async (input, imageFile, videoFile) => {
    setUpload(true);
    let image = null;
    let video = null;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "tweets");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dj1fjrjqx/image/upload`,
        formData
      );
      const data = await res.data;
      image = data.secure_url;
    } else if (videoFile) {
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("upload_preset", "comments");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dj1fjrjqx/video/upload`,
        formData
      );
      const data = await res.data;
      video = data.secure_url;
    }

    const res = await axios.post("/api/tweet", {
      text: input,
      image,
      video,
    });
    const data = await res.data;

    setUpload(false);
    return data;
  };
  return (
    <Maker
      Emojis={Emojis}
      user={user}
      handler={TweetHandler}
      upload={upload}
      buttonName={"Tweet"}
    />
  );
}
