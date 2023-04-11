import { FiMoreHorizontal } from "react-icons/fi";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import moment from "moment";
import { useRouter } from "next/dist/client/router";

export default function Conversation({ user, lastMsg, conversation }) {
  const router = useRouter();
  const date = moment(conversation.createdAt).fromNow();

  return (
    <div
      onClick={() => {
        router.push(`/messages/${conversation._id}`);
      }}
      className="transition-colors py-4 px-4 flex justify-between hover:bg-white-5 cursor-pointer"
    >
      <div className="flex">
        <div className="rounded-full bg-borderColor w-14 h-14 mr-4">
          <Image
            className="w-full h-full rounded-full"
            src={user.image}
            alt={"pfp"}
            width="100"
            height="100"
          />
        </div>
        <div className="flex flex-col ">
          <div className="flex text-p items-center">
            <h1 className="flex items-center mr-2 text-white-100 font-bold">
              {user.name.length > 7 ? `${user.name.slice(0, 6)}...` : user.name}{" "}
              {user.verified && (
                <MdVerified className="ml-1 w-4 h-4 text-blue-100" />
              )}
            </h1>
            <span className="mr-1">
              @{" "}
              {user.username.length > 7
                ? `${user.username.slice(0, 6)}...`
                : user.username}
            </span>
            <span className="ml-1">
              {date.length > 8 ? `${date.slice(0, 8)}...` : date}
            </span>
          </div>
          {lastMsg && lastMsg.length > 25 ? (
            <p className="text-p">{lastMsg.slice(0, 25)}...</p>
          ) : (
            <p className="text-p">{lastMsg || "no messages"}</p>
          )}
        </div>
      </div>
      <div>
        <FiMoreHorizontal />
      </div>
    </div>
  );
}
