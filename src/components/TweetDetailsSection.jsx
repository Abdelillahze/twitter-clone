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
import Player from "./Player";
import Maker from "./Maker";

export default function TweetDetailsSection({ user, tweet, refresh }) {
  const router = useRouter();
  const date = moment(tweet.createdAt);
  const [selector, setSelector] = useState(false);
  const [comment, setComment] = useState(false);
  const selectorRef = useRef(null);
  const [deleteOption, setDeleteOption] = useState(null);
  const [followOption, setFollowOption] = useState(null);
  const [following, setFollowing] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [editOption, setEditOption] = useState(null);
  const urlRegex =
    /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/g;
  const [url, setUrl] = useState(null);
  const tagRegex = /<@(?<username>[^<@>]+)>/gm;
  const [tag, setTag] = useState(null);
  const [username, setUsername] = useState(null);
  const [edit, setEdit] = useState(false);
  const [upload, setUpload] = useState(false);

  useEffect(() => {
    if (tweet) {
      const isUrl = tweet.text.match(urlRegex);
      setUrl(isUrl);
      const isThereTag = tweet.text.match(tagRegex);
      setTag(isThereTag);

      if (isThereTag) {
        const {
          groups: { username: Username },
        } = tagRegex.exec(isThereTag);
        const isUsername = async () => {
          const res = await axios.get(`/api/user/${Username}?only=true`);
          const data = await res.data;
          const isTag = data;
          setUsername(Username);
          if (!isTag) {
            setTag(null);
          }
        };
        isUsername();
      }
    }
    if (tweet.author._id === user._id) {
      setDeleteOption({
        label: "Delete",
        onClick: () => {
          deleteHandler();
        },
      });
      setEditOption({
        label: "Edit",
        onClick: () => {
          setEdit(true);
        },
      });
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

  const editHandler = async (input, imageFile, videoFile) => {
    console.log(input, imageFile, videoFile);
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
      formData.append("upload_preset", "tweets");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dj1fjrjqx/video/upload`,
        formData
      );
      const data = await res.data;
      video = data.secure_url;
    }
    const res = await axios.patch(`/api/tweet/${tweet._id}/edit`, {
      text: input,
      image,
      video,
    });
    const data = await res.data;

    setUpload(false);
    setEdit(false);
    refresh();
    return data;
  };

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

  if (edit) {
    return (
      <Maker
        user={user}
        info={tweet}
        handler={editHandler}
        upload={upload}
        buttonName={"Edit"}
      />
    );
  }

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
              {
                <Selector
                  ref={selectorRef}
                  className={
                    "hidden min-w-fit w-full text-white-100 bg-black-100 border border-borderColor rounded absolute bottom-[105%] right-full translate-y-full"
                  }
                  loading={!(followOption || deleteOption || editOption)}
                  options={[followOption, editOption, deleteOption]}
                />
              }
            </button>
          </div>
        </div>
        <p className="mb-4 whitespace-pre-wrap">
          {url || tag ? (
            tweet.text
              .split(new RegExp(`(${url && url[0]}|${tag && tag[0]})`))
              .map((t, i) => {
                if (tag && t === tag[0]) {
                  return (
                    <Link
                      className="text-blue-100 bg-blue-10"
                      href={`/${username}`}
                    >
                      @{username}
                    </Link>
                  );
                } else if (url && t === url[0]) {
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
                      href={`/${tweet.author.username}/status/${tweet._id}`}
                    >
                      {t.length > 150 ? t.slice(0, 150) : t}
                      {showMore && t.slice(150)}{" "}
                      {t.length > 150 && (
                        <button
                          onClick={() => setShowMore(!showMore)}
                          className="text-blue-100 cursor-pointer hover:underline"
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
              <Link href={`/${tweet.author.username}/status/${tweet._id}`}>
                {tweet.text.length > 150
                  ? tweet.text.slice(0, 150)
                  : tweet.text}
                {showMore && tweet.text.slice(150)}
              </Link>
              {tweet.text.length > 150 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-blue-100 cursor-pointer hover:underline"
                >
                  {showMore ? "show less" : "show more..."}
                </button>
              )}
            </>
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
          <Player
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
      {console.log(tweet)}
      {tweet.comments.map((comment) => (
        <Tweet
          user={user}
          tweet={comment}
          refresh={refresh}
          tweetAuthor={tweet.author.username}
        />
      ))}
    </div>
  );
}
