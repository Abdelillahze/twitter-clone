import Image from "next/image";
import Link from "next/link";
import { FaRegComment } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlineRetweet, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import moment from "moment";
import { MdVerified } from "react-icons/md";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Selector from "./Selector";
import Loading from "./Loading";
import { forwardRef } from "react";
import Player from "./Player";

export default forwardRef(function Tweet(
  { user, tweet, refresh, tweetAuthor },
  ref
) {
  const [selector, setSelector] = useState(false);
  const selectorRef = useRef(null);
  const [retweeted, setRetweeted] = useState(false);
  const [comment, setComment] = useState(false);
  const [tweetData, setTweetData] = useState(null);
  const date = moment(tweet.createdAt).fromNow();
  const [deleteOption, setDeleteOption] = useState(null);
  const [followOption, setFollowOption] = useState(null);
  const [following, setFollowing] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const urlRegex =
    /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/g;
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (selector && selectorRef.current) {
      selectorRef.current.style.display = "block";
    } else if (selectorRef.current) {
      selectorRef.current.style.display = "none";
    }
  }, [selector]);

  useEffect(() => {
    if (tweet.tweet && tweet.retweets === undefined) {
      setTweetData(tweet.tweet);
      setRetweeted(true);
    } else if (tweet.tweet && tweet.retweets !== undefined) {
      setTweetData(tweet);
      setComment(true);
    } else {
      setTweetData(tweet);
    }
  }, [tweet]);

  useEffect(() => {
    if (tweetData) {
      const isUrl = tweetData.text.match(urlRegex);
      setUrl(isUrl);
    }

    if (tweetData && tweetData.author._id === user._id) {
      setDeleteOption({
        label: "Delete",
        onClick: () => {
          deleteHandler();
        },
      });
    } else if (tweetData) {
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
  }, [tweetData]);

  const fetch = async () => {
    const res = await axios.get(`/api/follow/${tweetData.author._id}`);
    const data = await res.data;

    setFollowing(data.following);
  };

  const followHandler = async () => {
    await axios.patch("/api/follow/", {
      userId: tweetData.author._id,
    });

    refresh();

    await fetch();
  };

  const LikeHandler = async () => {
    const res = await axios.patch(`/api/tweet/${tweetData._id}/like`);
    refresh();

    return res;
  };

  const retweetHandler = async () => {
    const res = await axios.patch(
      `/api/tweet/${tweetData._id}/retweet?type=${
        comment ? "Comment" : "Tweet"
      }`
    );
    refresh();

    return res;
  };
  const deleteHandler = async () => {
    setSelector(false);
    const res = await axios.delete(`/api/tweet/${tweetData._id}/`);
    refresh();

    return res;
  };

  if (!tweetData) {
    return <div></div>;
  }

  return (
    <div
      className={`transition-all text-sm sm:text-base flex-col h-fit px-4 pb-2 flex transition-colors hover:bg-white-5 border border-transparent border-b-borderColor`}
    >
      {retweeted && (
        <div className="ml-8 flex text-p items-center py-2">
          <AiOutlineRetweet className="mr-2 " />{" "}
          <Link href={`/${tweet.author.username}`}>
            <span className="font-bold text-sm hover:underline">
              {tweet.author._id === user._id ? "You" : tweet.author.name}{" "}
              Retweeted
            </span>
          </Link>
        </div>
      )}
      <div className={`flex ${retweeted || "mt-4"}`}>
        <Link href={`/${tweetData.author.username}`} className="h-fit">
          <Image
            className="w-12 h-12 rounded-full mr-6"
            src={tweetData.author.image}
            alt={"pfp"}
            width="100"
            height="100"
          />
        </Link>
        <div className="flex flex-col w-full">
          <div className="flex items-center">
            <Link href={`/${tweetData.author.username}`} className="flex">
              <h1 className="flex items-center mr-2 hover:underline font-bold">
                {tweetData?.author.name}{" "}
                {tweetData.author.verified && (
                  <MdVerified className="ml-1 w-4 h-4 text-blue-100" />
                )}
              </h1>
              <span className="mr-2 text-p">
                @{tweetData.author.username} {}
              </span>
            </Link>
            <span className="mr-2 text-p">·</span>
            <span className="mr-2 text-p">{date}</span>
          </div>
          {tweetAuthor && (
            <div className="text-p">
              Replying to{" "}
              <Link
                href={`/${tweetAuthor}`}
                className="text-blue-100 hover:underline"
              >
                @{tweetAuthor}
              </Link>
            </div>
          )}
          <p ref={ref} className="w-full mb-2 whitespace-pre-wrap">
            {url ? (
              tweetData.text.split(new RegExp(`(?=${url[0]})`)).map((t, i) => {
                if (t === url[0]) {
                  return (
                    <a
                      target="_blank"
                      className="text-blue-100 hover:underline"
                      href={url[0]}
                    >
                      {url[0]}
                    </a>
                  );
                } else {
                  return (
                    <Link
                      className="w-full"
                      href={`/${tweetData.author.username}/status/${tweetData._id}`}
                    >
                      {t.length > 150 ? t.slice(0, 150) : t}
                      {showMore && t.slice(150)}{" "}
                      {t.length > 150 && (
                        <button
                          onClick={() => setShowMore(!showMore)}
                          className="font-bold cursor-pointer hover:underline"
                        >
                          {showMore ? "show less" : "show more..."}
                        </button>
                      )}
                    </Link>
                  );
                }
              })
            ) : (
              <>
                <Link
                  href={`/${tweetData.author.username}/status/${tweetData._id}`}
                >
                  {tweetData.text.length > 150
                    ? tweetData.text.slice(0, 150)
                    : tweetData.text}
                  {showMore && tweetData.text.slice(150)}
                  {tweetData.text.length > 150 && (
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="font-bold cursor-pointer hover:underline"
                    >
                      {showMore ? "show less" : "show more..."}
                    </button>
                  )}
                </Link>
              </>
            )}
          </p>
          {tweetData.image && (
            <Link
              href={`/${tweetData.author.username}/status/${tweetData._id}`}
            >
              <Image
                className="rounded mb-2"
                src={tweetData.image}
                alt="image"
                width="1000"
                height="500"
              />
            </Link>
          )}
          {tweetData.video && (
            <Player
              className="w-full rounded mb-2"
              src={tweetData.video}
              alt="video"
            />
          )}
          <div className="flex w-2/3 justify-between text-p">
            <div className="group">
              <Link
                href={`/${tweetData.author.username}/status/${tweetData._id}`}
              >
                <button className="flex items-center transition-colors group-hover:text-blue-100 ">
                  <FaRegComment className="w-8 h-8 mr-2 px-2 py-2 group-hover:bg-blue-10 rounded-full" />
                  {tweetData.comments.length}
                </button>
              </Link>
            </div>
            <div className="group">
              <button
                onClick={retweetHandler}
                className="flex items-center transition-colors group-hover:text-green-100"
              >
                <AiOutlineRetweet
                  className={`${
                    tweetData.retweets?.find(
                      (retweet) => retweet.author === user._id
                    ) && "text-green-100"
                  } w-8 h-8 mr-2 px-2 py-2 rounded-full group-hover:bg-green-10`}
                />
                <span
                  className={`${
                    tweetData.retweets?.find(
                      (retweet) => retweet.author === user._id
                    ) && "text-green-100"
                  } `}
                >
                  {tweetData.retweets?.length}
                </span>
              </button>
            </div>
            <div className="group">
              <button
                onClick={LikeHandler}
                className="flex items-center transition-colors group-hover:text-pink-100"
              >
                {tweetData.likes?.find((like) => like.author === user._id) ? (
                  <AiFillHeart className="w-8 h-8 mr-2 px-2 py-2 rounded-full text-pink-100 group-hover:bg-pink-10" />
                ) : (
                  <AiOutlineHeart className="w-8 h-8 mr-2 px-2 py-2 rounded-full group-hover:bg-pink-10" />
                )}

                <span
                  className={`${
                    tweetData.likes?.find((like) => like.author === user._id) &&
                    "text-pink-100"
                  } `}
                >
                  {tweetData.likes?.length}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="group">
          <button className="relative flex transition-colors group-hover:text-blue-100">
            <FiMoreHorizontal
              onClick={() => setSelector(!selector)}
              className="w-8 h-8 mr-2 px-2 py-2 group-hover:bg-blue-10 rounded-full"
            />
            {(followOption || deleteOption) && (
              <Selector
                ref={selectorRef}
                className={
                  "hidden min-w-fit w-full text-white-100 bg-black-100 border border-borderColor rounded absolute bottom-[105%] right-full translate-y-full"
                }
                options={[followOption, deleteOption]}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
