import Maker from "./Maker";
import axios from "axios";
import { useState } from "react";

export default function CommentMaker({ user, tweetId, className }) {
  const [upload, setUpload] = useState(false);
  const CommentHandler = async (input) => {
    setUpload(true);
    const res = await axios.patch(`/api/tweet/${tweetId}/comment`, {
      text: input,
    });
    const data = await res.data;

    setUpload(false);
    return data;
  };
  return (
    <Maker
      className={className}
      handler={CommentHandler}
      upload={upload}
      user={user}
      buttonName={"Reply"}
    />
  );
}
