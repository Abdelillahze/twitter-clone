import Maker from "./Maker";
import axios from "axios";
import { useState } from "react";

export default function TweetMaker({ user }) {
  const [upload, setUpload] = useState(false);
  const TweetHandler = async (input) => {
    setUpload(true);
    const res = await axios.post("/api/tweet", {
      text: input,
    });
    const data = await res.data;

    console.log(data);

    setUpload(false);
    return data;
  };
  return (
    <Maker
      user={user}
      handler={TweetHandler}
      upload={upload}
      buttonName={"Tweet"}
    />
  );
}
