import { BiMessageAdd } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import Conversation from "./Conversation";
import Loading from "./Loading";
import { useRouter } from "next/router";

export default function ConversationList({
  className,
  user,
  conversations,
  loading,
}) {
  const router = useRouter();
  return (
    <div
      className={`overflow-scroll w-full ${className} lg:block min-h-[100vh] h-full lg:w-2/5 py-4 border border-transparent border-r-borderColor`}
    >
      <div className="px-2">
        {/* head */}
        <div className="mb-4 px-2 py-2 flex justify-between">
          <h1 className="font-bold text-xl">Messages</h1>
          <div className="flex items-center">
            <FiSettings className={`${icon} mr-2`} />
            <BiMessageAdd className={icon} />
          </div>
        </div>
        {/* search */}
        <div className="px-2">
          <input
            type="text"
            placeholder="Search Direct Messages"
            className="transition-colors mb-4 w-full h-12 focus:border-blue-100 px-4 py-4 rounded-full outline-none bg-transparent focus:border-2 border border-borderColor"
          />
        </div>
      </div>
      {loading ? (
        <Loading className={"mx-auto"} />
      ) : conversations && conversations.length !== 0 ? (
        conversations.map((conversation) => {
          return (
            <Conversation
              conversation={conversation}
              lastMsg={conversation.messages.at(-1)?.text}
              user={
                conversation.members.length > 2
                  ? conversation
                  : conversation.members.filter(
                      (member) => member._id !== user._id
                    )[0]
              }
            />
          );
        })
      ) : (
        <p className="text-center text-p">ard wa7id d7ko 3lih</p>
      )}
    </div>
  );
}

const icon = "w-4 h-4 cursor-pointer";
