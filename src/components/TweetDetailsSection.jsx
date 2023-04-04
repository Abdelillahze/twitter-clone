import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { MdVerified } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlineHeart, AiOutlineRetweet, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import CommentMaker from "./CommentMaker";
import { useRouter } from "next/router";
import Selector from "./Selector";
import Tweet from "./Tweet";
import { useState, useRef, useEffect } from "react";

export default function TweetDetailsSection({ user, tweet, refresh }) {
  const router = useRouter();
  const date = moment(tweet.createdAt);
  const [selector, setSelector] = useState(false);
  const [comment, setComment] = useState(false);
  const selectorRef = useRef(null);
  const [mine, setMine] = useState(false);
  const [deleteOption, setDeleteOption] = useState(null);
  const [followOption, setFollowOption] = useState(null);
  const [following, setFollowing] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (tweet.author._id === user._id) {
      setMine(true);
    } else {
      const followingHandler = async () => {
        fetch();
        setFollowOption({
          label: following ? "UnFollow" : "Follow",
          onClick: () => {
            followHandler();
          },
        });
      };
      followingHandler();
    }

    if (mine) {
      setDeleteOption({
        label: "Delete",
        onClick: () => {
          deleteHandler();
        },
      });
    }
  }, [tweet]);

  const fetch = async () => {
    const res = await axios.get(`/api/follow/${tweet.author._id}`);
    const data = await res.data;

    setFollowing(data.following);
  };

  const followHandler = async () => {
    await axios.patch("/api/follow/", {
      userId: tweet.author._id,
    });

    refresh();

    await fetch();
  };

  useEffect(() => {
    if (tweet.tweet && tweet.retweets !== undefined) {
      setComment(true);
    }
  }, []);

  if (selector && selectorRef.current) {
    selectorRef.current.style.display = "block";
  } else if (selectorRef.current) {
    selectorRef.current.style.display = "none";
  }

  const retweetHandler = async () => {
    const res = await axios.patch(
      `/api/tweet/${tweet._id}/retweet?type=${comment ? "Comment" : "Tweet"}`
    );
    refresh();

    return res;
  };

  const deleteHandler = async () => {
    setSelector(false);
    const res = await axios.delete(`/api/tweet/${tweet._id}/`);
    router.push("/home");
    refresh();

    return res;
  };

  const LikeHandler = async () => {
    const res = await axios.patch(`/api/tweet/${tweet._id}/like`);
    refresh();

    return res;
  };

  return (
    <div className="py-2">
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
          <div className="group">
            <button className="relative flex transition-colors group-hover:text-blue-100">
              <FiMoreHorizontal
                onClick={() => setSelector(!selector)}
                className="w-8 h-8 mr-2 px-2 py-2 group-hover:bg-blue-10 rounded-full"
              />
              <Selector
                ref={selectorRef}
                className={
                  "hidden min-w-fit w-full text-white-100 bg-black-100 border border-borderColor rounded absolute bottom-[105%] right-full translate-y-full"
                }
                options={[followOption, deleteOption]}
              />
            </button>
          </div>
        </div>
        <p className="mb-4 whitespace-pre-wrap">
          {tweet.text.length > 150 ? tweet.text.slice(0, 150) : tweet.text}
          {showMore && tweet.text.slice(150)}{" "}
          {tweet.text.length > 150 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="font-bold cursor-pointer hover:underline"
            >
              {showMore ? "show less" : "show more..."}
            </button>
          )}
        </p>
        {tweet.image && (
          <Image
            className="rounded mb-4"
            src={tweet.image}
            alt="image"
            width="1000"
            height="1000"
          />
        )}
        {tweet.video && (
          <video
            controls
            className="rounded mb-4 w-full"
            src={tweet.video}
            alt="video"
            width="1000"
            height="500"
          />
        )}
        <p className="text-p">
          {date.format("LT")} · {date.format("ll")}
        </p>
      </div>
      {/* stats */}

      {!(
        tweet.likes.length === 0 &&
        tweet.retweets.length === 0 &&
        tweet.comments.length === 0
      ) && (
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
          {tweet.comments.length === 0 || (
            <span className="mr-4 font-bold">
              {tweet.comments.length}
              <span className="text-p font-normal ml-1">Comments</span>
            </span>
          )}
        </div>
      )}
      <div className="w-full flex px-10 py-2 justify-between text-p border border-transparent border-b-borderColor">
        <div className="group">
          <button
            onClick={() => {
              document.querySelector(".tweet-input").focus();
            }}
            className="flex items-center transition-colors group-hover:text-blue-100 "
          >
            <FaRegComment className="w-10 h-10 mr-2 px-2 py-2 group-hover:bg-blue-10 rounded-full" />
          </button>
        </div>
        <div className="group">
          <button
            onClick={retweetHandler}
            className="flex items-center transition-colors group-hover:text-green-100"
          >
            <AiOutlineRetweet
              className={`w-10 h-10 mr-2 px-2 py-2 rounded-full group-hover:bg-green-10 ${
                tweet.retweets.find((retweet) => retweet.author === user._id) &&
                "text-green-100"
              }`}
            />
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
      <CommentMaker user={user} tweetId={tweet._id} />
      {tweet.comments.map((comment) => (
        <div key={comment._id}>
          <Tweet
            user={user}
            tweet={comment}
            refresh={refresh}
            tweetAuthor={tweet.author.username}
          />
        </div>
      ))}
    </div>
  );
}
