import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { MdVerified } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlineHeart, AiOutlineRetweet, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import CommentMaker from "./CommentMaker";

export default function TweetDetailsSection({ user, tweet, refresh }) {
  const date = moment(tweet.createdAt);

  const LikeHandler = async () => {
    const res = await axios.patch(`/api/tweet/${tweet._id}/like`);
    refresh();

    return res;
  };

  return (
    <div className="mt-14 py-2">
      <div className="border border-transparent border-b-borderColor pb-4 px-4">
        <div className="flex justify-between mb-4">
          <div className="flex">
            <Link href={`/${tweet.author.username}`}>
              <Image
                className="w-12 h-12 rounded-full mr-4"
                src={tweet.author.image}
                alt={"pfp"}
                width="100"
                height="100"
              />
            </Link>
            <div className="flex flex-col ">
              <Link href={`/${tweet.author.username}`}>
                <h1 className="flex items-center hover:underline font-bold">
                  {tweet.author.name}{" "}
                  {tweet.author.verified && (
                    <MdVerified className="text-blue-100 ml-1" />
                  )}
                </h1>
                <span className="text-p">@{tweet.author.username}</span>
              </Link>
            </div>
          </div>
          <FiMoreHorizontal />
        </div>
        <p className="mb-4">{tweet.text}</p>
        <p className="text-p">
          {date.format("LT")} · {date.format("ll")}
        </p>
      </div>
      {/* stats */}
      {!(tweet.likes.length === 0 || tweet.retweets.length === 0) && (
        <div className="w-full flex py-4 border border-transparent border-b-borderColor px-4">
          {tweet.likes.length === 0 || (
            <span className="mr-4 font-bold">
              {tweet.likes.length}
              <span className="text-p font-normal ml-1">Likes</span>
            </span>
          )}
          {tweet.retweets.length === 0 || (
            <span className="mr-4 font-bold">
              {tweet.retweets.length}
              <span className="text-p font-normal ml-1">Retweets</span>
            </span>
          )}
        </div>
      )}
      <div className="w-full flex px-10 py-2 justify-between text-p border border-transparent border-b-borderColor">
        <div className="group">
          <button className="flex items-center transition-colors group-hover:text-blue-100 ">
            <FaRegComment className="w-10 h-10 mr-2 px-2 py-2 group-hover:bg-blue-10 rounded-full" />
          </button>
        </div>
        <div className="group">
          <button className="flex items-center transition-colors group-hover:text-green-100">
            <AiOutlineRetweet className="w-10 h-10 mr-2 px-2 py-2 rounded-full group-hover:bg-green-10" />
          </button>
        </div>
        <div className="group">
          <button
            onClick={LikeHandler}
            className="flex items-center transition-colors group-hover:text-pink-100"
          >
            {tweet.likes.find((like) => like.author === user._id) ? (
              <AiFillHeart className="w-10 h-10 mr-2 px-2 py-2 rounded-full text-pink-100 group-hover:bg-pink-10" />
            ) : (
              <AiOutlineHeart className="w-10 h-10 mr-2 px-2 py-2 rounded-full group-hover:bg-pink-10" />
            )}
          </button>
        </div>
      </div>
      <CommentMaker user={user} />
    </div>
  );
}
