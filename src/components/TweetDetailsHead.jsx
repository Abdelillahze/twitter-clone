import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import Image from "next/image";

export default function TweetDetailsHead({ user }) {
  return (
    <div className="flex py-2 justify-start items-start fixed top-0 h-14 sm:items-center px-4 backdrop-blur-md">
      <Image
        onClick={() => {
          document.querySelector(".sidebar").style.translate = "100%";
          document.querySelector(".section").style.opacity = ".5";
        }}
        className="w-10 h-10 sidebar-button cursor-pointer sm:hidden rounded-full"
        src={user.image}
        alt={"pfp"}
        width="30"
        height="30"
      />
      <div className="flex items-center">
        <Link href="/home">
          <FiArrowLeft className="mr-2 h-10 w-10 px-2 py-2 rounded-full transition-colors hover:bg-white-10" />
        </Link>
        <h1 className="font-bold">Tweet</h1>
      </div>
    </div>
  );
}
