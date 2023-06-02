import { FaUserAlt } from "react-icons/fa";
import { AiFillHeart, AiOutlineRetweet } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import axios from "axios";

const Notification = ({ data }) => {
  const el = useRef(null);
  const observer = new IntersectionObserver(
    (entries) => {
      const res = axios.patch(`/api/notification/${data._id}`);
    },
    { threshold: 1 }
  );

  useEffect(() => {
    if (el.current) {
      observer.observe(el.current);
    }
  }, []);

  return (
    <>
      <Link
        href={
          data.type === "follow"
            ? `/${data.author.username}`
            : `/${data.author.username}/status/${data.tweet}`
        }
      >
        <div
          ref={el}
          className={`flex p-4 ${
            !data.readed ? "bg-white-10" : ""
          } border-b hover:bg-white-5 transition-colors border-b-borderColor`}
        >
          {data.type === "follow" && (
            <FaUserAlt className="w-6 h-6 text-blue-100 mr-4 mt-2" />
          )}
          {data.type === "like" && (
            <AiFillHeart className="w-6 h-6 text-pink-100 mr-4 mt-2" />
          )}
          {data.type === "retweet" && (
            <AiOutlineRetweet className="w-6 h-6 text-green-100 mr-4 mt-2" />
          )}
          {data.type === "comment" && (
            <FaRegComment className="w-6 h-6 text-blue-100 mr-4 mt-2" />
          )}
          <div className="flex flex-col">
            <div className="w-10 h-10 rounded-full mb-2">
              <Image
                className="border border-borderColor rounded-full"
                src={data.author.image}
                width={500}
                height={500}
              />
            </div>
            <p className="text-sm">
              <span className="font-bold">{data.author.name}</span>
              {data.type === "follow" && " starts following you"}
              {data.type === "like" && " liked your tweet"}
              {data.type === "retweet" && " retweeted your tweet"}
              {data.type === "comment" && " commented to your tweet"}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Notification;
