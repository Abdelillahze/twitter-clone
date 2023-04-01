import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";
import Image from "next/image";

export default function ProfileHead({ fetchedUser }) {
  const router = useRouter();
  return (
    <div className="flex z-10 fixed top-0 h-14 items-center px-4 backdrop-blur-md">
      <Image
        onClick={() => {
          document.querySelector(".sidebar").style.translate = "100%";
          document.querySelector(".section").style.opacity = ".5";
        }}
        className="w-10 h-10 sm:hidden sidebar-button cursor-pointer rounded-full"
        src={fetchedUser.image}
        alt={"pfp"}
        width="30"
        height="30"
      />
      <FiArrowLeft
        onClick={() => router.back()}
        className="cursor-pointer mr-4 h-10 w-10 px-2 py-2 rounded-full transition-colors hover:bg-white-10"
      />
      <div>
        <h1 className="font-bold">{fetchedUser.name}</h1>
        <span className="text-p">{fetchedUser.tweets.length} tweets</span>
      </div>
    </div>
  );
}
