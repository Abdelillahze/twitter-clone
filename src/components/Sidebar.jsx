import Link from "next/link";
import Image from "next/image";
import Selector from "./Selector";
import {
  BiHomeCircle,
  BiSearch,
  BiMessageDetail,
  BiBookmark,
  BiUser,
} from "react-icons/bi";
import { IoNotifications } from "react-icons/io5";
import { CiCircleMore } from "react-icons/ci";
import { FiFeather, FiMoreHorizontal } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";

const fetcher = (...args) => axios.get(...args).then((res) => res.data);

export default function Sidebar({ user }) {
  const { data, error, isLoading } = useSWR("/api/notification", fetcher);
  const router = useRouter();
  const [selector, setSelector] = useState(false);
  const selectorRef = useRef(null);

  if (selector && selectorRef.current) {
    selectorRef.current.style.display = "block";
  } else if (selectorRef.current) {
    selectorRef.current.style.display = "none";
  }

  useEffect(() => {
    document.addEventListener("click", (event) => {
      const el = document.querySelector(".sidebar");
      const btn = document.querySelector(".sidebar-button");
      if (!el || !btn) return;
      if (
        !(!el.contains(event.target) && !btn.contains(event.target)) &&
        window.innerWidth < 640
      ) {
        el.style.translate = "100%";
        document.querySelector(".section").style.opacity = ".5";
      } else if (window.innerWidth < 640) {
        el.style.translate = "-100%";
        document.querySelector(".section").style.opacity = "1";
      } else {
        el.style.translate = "0%";
      }
    });
  }, []);

  return (
    <div className="min-h-[100vh] text-white-100 h-full transition-all -translate-x-full sm:translate-x-0 sidebar z-20 bg-black-100 absolute top-0 left-0 sm:relative md:sticky w-8/12 sm:w-2/12 xl:w-3/12  sm:block">
      <div className="w-full sticky top-0 min-h-[100vh] py-4 px-6 border border-transparent border-r-borderColor">
        <div className="mt-4 sm:mt-0 container flex flex-col justify-start items-start sm:items-center xl:items-start">
          <Link
            href="/home"
            className="hidden sm:flex items-center justify-center hover:bg-blue-10 w-14 h-14 rounded-full"
          >
            <Image
              className="w-8 h-8 my-2"
              src="/twitter-logo.webp"
              alt="twitter logo"
              width="50"
              height="50"
            />
          </Link>
          <Link
            href="/home"
            className="flex text-start items-center hover:bg-white-10 px-3 py-1 xl:px-4 pr-6 sm:pr-3 xl:pr-6 rounded-full"
          >
            <BiHomeCircle className="w-8 h-8 my-2 mr-4 sm:mr-0 xl:mr-4" />
            <span className="block sm:hidden xl:block">Home</span>
          </Link>
          <Link
            href="#"
            className="flex items-center hover:bg-white-10 px-3 py-1 xl:px-4 pr-6 sm:pr-3 xl:pr-6  rounded-full"
          >
            <BiSearch className="w-8 h-8 my-2 mr-4 sm:mr-0 xl:mr-4" />
            <span className="block sm:hidden xl:block">Search</span>
          </Link>
          <Link
            href="/notifications"
            className="flex items-center hover:bg-white-10 px-3 py-1 xl:px-4 pr-6 sm:pr-3 xl:pr-6 rounded-full"
          >
            <div className="relative">
              <IoNotifications className="w-8 h-8 my-2 mr-4 sm:mr-0 xl:mr-4" />
              {data.notifications.filter(
                (notification) => notification.readed === false
              ).length > 0 && (
                <span className="absolute bg-blue-100 w-4 h-4 text-center rounded-full text-xs top-0 right-2">
                  {data.notifications.filter(
                    (notification) => notification.readed === false
                  ).length > 99
                    ? "+99"
                    : data.notifications.filter(
                        (notification) => notification.readed === false
                      ).length}
                </span>
              )}
            </div>
            <span className="block sm:hidden xl:block">Notifications</span>
          </Link>
          <Link
            href="/messages"
            className="flex items-center hover:bg-white-10 px-3 py-1 xl:px-4 pr-6 sm:pr-3 xl:pr-6 rounded-full"
          >
            <BiMessageDetail className="w-8 h-8 my-2 mr-4 sm:mr-0 xl:mr-4" />
            <span className="block sm:hidden xl:block">Messages</span>
          </Link>
          <Link
            href="#"
            className="flex items-center hover:bg-white-10 px-3 py-1 xl:px-4 pr-6 sm:pr-3 xl:pr-6 rounded-full"
          >
            <BiBookmark className="w-8 h-8 my-2 mr-4 sm:mr-0 xl:mr-4" />
            <span className="block sm:hidden xl:block">Bookmarks</span>
          </Link>
          <Link
            href={`/${user.username}`}
            className="flex items-center hover:bg-white-10 px-3 py-1 xl:px-4 pr-6 sm:pr-3 xl:pr-6  rounded-full"
          >
            <BiUser className="w-8 h-8 my-2 mr-4 sm:mr-0 xl:mr-4" />
            <span className="block sm:hidden xl:block">Profile</span>
          </Link>
          <Link
            href="#"
            className="flex items-center hover:bg-white-10 px-3 py-1 xl:px-4 pr-6 sm:pr-3 xl:pr-6  rounded-full"
          >
            <CiCircleMore className="w-8 h-8 my-2 mr-4 sm:mr-0 xl:mr-4" />
            <span className="block sm:hidden xl:block">More</span>
          </Link>
          <button
            onClick={() => {
              if (document.querySelector(".tweet-input")) {
                document.querySelector(".tweet-input").focus();
              } else {
                router.push("/home");
              }
            }}
            className="my-2 w-10/12 sm:w-10 h-10 xl:w-10/12 xl:mx-auto bg-blue-100 text-white font-bold rounded-full xl:rounded flex justify-center items-center"
          >
            <FiFeather className="hidden sm:block xl:hidden w-4 h-4" />
            <span className="block sm:hidden xl:block">Tweet</span>
          </button>

          <button
            onClick={() => {
              setSelector(!selector);
            }}
            className="mt-4 relative flex justify-between sm:justify-center xl:justify-between cursor-pointer w-full sm:w-16 h-16 xl:w-full px-4 sm:px-0 xl:px-4 items-center rounded-full transition-colors hover:bg-white-10"
          >
            <div className="flex items-center justify-center">
              <Image
                className="w-10 h-10 rounded-full mr-4 sm:mr-0 xl:mr-4"
                src={user.image}
                alt={"pfp"}
                width="100"
                height="100"
              />
              <div className="block sm:hidden xl:block">
                <h1>{user.name}</h1>
                <h2 className="text-p">@{user.username}</h2>
              </div>
            </div>
            <FiMoreHorizontal className="block sm:hidden xl:block w-5 h-5" />
            <Selector
              ref={selectorRef}
              className={
                "hidden min-w-fit w-full bg-black-100 border border-borderColor rounded absolute bottom-[105%] left-full xl:left-1/2 -translate-x-1/2"
              }
              options={[
                {
                  label: `Logout @${user.username}`,
                  onClick: () => signOut(),
                },
              ]}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
