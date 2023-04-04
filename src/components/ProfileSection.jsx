import { createPortal } from "react-dom";
import Image from "next/image";
import { FiMoreHorizontal } from "react-icons/fi";
import ImageView from "./ImageView";
import { useState, useEffect, useRef } from "react";
import { BsCalendar3 } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import axios from "axios";
import Tweet from "./Tweet";
import EditProfile from "./EditProfile";
import Loading from "./Loading";

export default function ProfileSection({
  fetchedUser,
  user,
  me,
  loading,
  refresh,
  data,
  addSearch,
}) {
  const [parent, setParent] = useState(null);
  const [following, setFollowing] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const date = new Date(fetchedUser.createdAt);
  const buttonRef = useRef(null);

  useEffect(() => {
    fetch();

    setParent(document.getElementById("portal"));
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", (event) => {
      const end = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY === end) {
        addSearch();
      }
    });
  }, []);

  const tweets = [];
  for (let i = 0; i < data?.length; i++) {
    tweets.push(
      data[i].data.map((tweet) => {
        return (
          <div key={tweet._id}>
            <Tweet user={user} refresh={refresh} tweet={tweet} />
          </div>
        );
      })
    );
  }

  if (following && buttonRef.current) {
    buttonRef.current.classList.add("followed");
  } else if (buttonRef.current) {
    buttonRef.current.classList.remove("followed");
  }

  if (parent && (showImage || showEditProfile)) {
    parent.style.display = "block";
  } else if (parent) {
    parent.style.display = "none";
  }

  const changeShowImage = () => {
    setShowImage(false);
  };

  const changeShowEditProfile = () => {
    setShowEditProfile(false);
  };

  const fetch = async () => {
    const res = await axios.get(`/api/follow/${fetchedUser._id}`);
    const data = await res.data;

    setFollowing(data.following);
  };

  const followHandler = async () => {
    await axios.patch("/api/follow/", {
      userId: fetchedUser._id,
    });

    refresh();

    await fetch();
  };

  return (
    <div className="section w-full">
      {showImage &&
        createPortal(
          <ImageView
            image={fetchedUser.image}
            changeShowImage={changeShowImage}
          />,
          parent
        )}
      {showEditProfile &&
        createPortal(
          <EditProfile
            changeShowEditProfile={changeShowEditProfile}
            refresh={refresh}
          />,
          parent
        )}
      <div className="w-full h-48 bg-banner">
        {fetchedUser.banner && (
          <Image
            className="h-full object-cover"
            src={fetchedUser.banner}
            alt={"banner"}
            width="2000"
            height="1000"
          />
        )}
      </div>
      <div className="flex h-24 justify-between px-4 py-4 items-start mb-2">
        <div className="w-36 h-36 bg-banner rounded-full -translate-y-1/2 border-4 border-black-100 cursor-pointer">
          <Image
            onClick={() => setShowImage(true)}
            quality="100"
            className="w-full h-full rounded-full hover:opacity-90"
            src={fetchedUser.image}
            alt={"pfp"}
            sizes="50vw"
            fill={true}
          />
        </div>
        {me ? (
          <button
            onClick={() => setShowEditProfile(true)}
            className="border border-borderColor px-4 py-2 rounded-full font-bold transition-colors hover:bg-white-10"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex">
            <FiMoreHorizontal className="flex items-center justify-center mr-4 h-10 w-10 px-2 text-white-100 border border-borderColor rounded-full transition-colors hover:bg-white-10 cursor-pointer" />
            <button
              onMouseEnter={(e) => {
                if (following) {
                  e.target.innerHTML = "Unfollow";
                }
              }}
              onMouseOut={(e) => {
                if (following) {
                  e.target.innerHTML = "Followed";
                }
              }}
              ref={buttonRef}
              onClick={followHandler}
              className="bg-white-100 w-28 px-4 py-2 rounded-full font-bold text-black-100 transition-all hover:opacity-90"
            >
              {following ? "Followed" : "Follow"}
            </button>
          </div>
        )}
      </div>
      <div className="w-full px-4 pb-4 border border-transparent border-b-borderColor">
        <h1 className="flex items-center font-bold text-lg">
          {fetchedUser.name}{" "}
          {fetchedUser.verified && (
            <MdVerified className="ml-2 w-6 h-6 text-blue-100" />
          )}
        </h1>
        <p className="text-p mb-2">@{fetchedUser.username}</p>
        <p className="text-white mb-2">{fetchedUser.bio}</p>
        <div className="text-p flex items-center">
          <BsCalendar3 className="mr-2" /> Joined{" "}
          {date.toLocaleString("en", { year: "numeric", month: "long" })}
        </div>
        <div className="flex mt-2">
          <span className="font-bold mr-2">
            {fetchedUser.following.length}{" "}
            <span className="text-p font-normal">Following</span>
          </span>
          <span className="font-bold">
            {fetchedUser.followers.length}{" "}
            <span className="text-p font-normal">Followers</span>
          </span>
        </div>
      </div>
      {/* // tweets */}
      <div>{tweets}</div>
      {loading && <Loading className={"mx-auto my-4"} />}
    </div>
  );
}
