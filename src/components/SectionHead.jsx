import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function SectionHead({ user, type, changePostsType }) {
  const foryouRef = useRef(null);
  const followingRef = useRef(null);

  useEffect(() => {
    if (foryouRef.current && followingRef.current) {
      if (type === "foryou") {
        foryouRef.current.classList.add("active-posts-type");
        followingRef.current.classList.remove("active-posts-type");
      }
      if (type === "following") {
        followingRef.current.classList.add("active-posts-type");
        foryouRef.current.classList.remove("active-posts-type");
      }
    }
  }, [type]);

  return (
    <div className="z-20 transition-all w-full sticky top-0 bg-black-30 backdrop-blur-md">
      <div className="border border-transparent border-b-borderColor">
        <div className="flex justify-between mb-2 px-6 py-4">
          <Image
            onClick={() => {
              document.querySelector(".sidebar").style.translate = "100%";
              document.querySelector(".section").style.opacity = ".5";
            }}
            className="sm:hidden w-10 h-10 sidebar-button cursor-pointer rounded-full"
            src={user.image}
            alt={"pfp"}
            width="30"
            height="30"
          />
          <h1 className="font-bold">Home</h1>
        </div>
        <div className="flex w-full">
          <button
            onClick={() => {
              changePostsType("foryou");
            }}
            className="w-1/2 h-12 hover:bg-white-10 transition-colors"
          >
            <span
              ref={foryouRef}
              className="active-posts-type w-fit flex items-center h-full mx-auto border-4 border-transparent text-p"
            >
              For You
            </span>
          </button>
          <button
            onClick={() => {
              changePostsType("following");
            }}
            className="w-1/2 h-12 hover:bg-white-10 transition-colors"
          >
            <span
              ref={followingRef}
              className="text-p w-fit flex items-center h-full mx-auto border-4 border-transparent"
            >
              Following
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
