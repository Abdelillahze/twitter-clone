import Maker from "./Maker";
import axios from "axios";
import { useState } from "react";

export default function CommentMaker({ user, tweetId }) {
  const [upload, setUpload] = useState(false);
  const CommentHandler = async (input) => {
    setUpload(true);
    const res = await axios.post(`/api/tweet/${tweetId}`, {
      text: input,
    });
    const data = await res.data;

    console.log(data);

    setUpload(false);
    return data;
  };
  return (
    <Maker
      handler={CommentHandler}
      upload={upload}
      user={user}
      buttonName={"Reply"}
    />
  );
}
