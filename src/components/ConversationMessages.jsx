import { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { BsImage, BsEmojiSmile } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import Image from "next/image";
import Picker from "@emoji-mart/react";
import axios from "axios";
import Message from "./Message";

export default function ConversationMessages({ me, conversation, refresh }) {
  const [Emojis, setEmojis] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [receiver, setReceiver] = useState(
    conversation.members.filter((member) => member._id !== me._id)[0]
  );
  const [conversationDetails, setConversationDetails] = useState({
    name: conversation.name || receiver.name,
    image: conversation.image || receiver.image,
    verified: receiver.verified || null,
  });
  const [data, setData] = useState({
    input: "",
    image: null,
    video: null,
  });

  useEffect(() => {
    const fetchEmojis = async () => {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
      );
      const data = await response.json();

      setEmojis(data);
    };

    fetchEmojis();
  }, []);

  const addEmoji = (e) => {
    const emoji = e.native;
    setData((data) => ({ ...data, input: data.input + emoji }));
  };

  const messageHandler = async () => {
    await axios.post(`/api/conversation/${conversation._id}/message`, data);

    setData({ input: "", image: null, video: null });
    refresh();
  };

  return (
    <div className="relative max-h-screen w-full lg:w-3/5">
      {/* head */}
      <div className="px-4 py-4 w-full flex justify-between items-center">
        <div className="flex items-center">
          <Image
            className="w-8 h-8 rounded-full mr-2"
            src={conversationDetails.image}
            alt="pfp"
            width={"100"}
            height={"100"}
          />
          <h1 className="flex items-center font-bold">
            {conversationDetails.name}
            {""}
            {conversationDetails.verified && (
              <MdVerified className="ml-1 w-4 h-4 text-blue-100" />
            )}
          </h1>
        </div>
        <BiInfoCircle className="cursor-pointer w-6 h-6" />
      </div>
      {/* messages */}
      <div className="px-4 py-2 h-[80%] overflow-scroll">
        {conversation.messages.map((message) => {
          return <Message message={message} isMe={message.author === me._id} />;
        })}
      </div>

      {/* sender */}
      <div className="h-[12%] bg-black-100 absolute bottom-0 px-4 py-2 border border-transparent border-t-borderColor w-full">
        <div className="flex w-full items-center px-2 py-2 rounded-md bg-borderColor">
          <BsImage className="ml-2 mr-4 text-blue-100 cursor-pointer" />
          <BsEmojiSmile
            onClick={() => setShowEmojis(!showEmojis)}
            className="mr-4 text-blue-100 cursor-pointer"
          />
          {showEmojis &&
            (Emojis ? (
              <div className="absolute bottom-16">
                <Picker data={Emojis} onEmojiSelect={addEmoji} />
              </div>
            ) : (
              <Loading className="absolute top-[100%]" />
            ))}
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                messageHandler();
              }
            }}
            type="text"
            placeholder="Start a new message"
            onChange={(e) =>
              setData((data) => ({ ...data, input: e.target.value }))
            }
            value={data.input}
            className="w-full bg-transparent outline-none py-2"
          />
          <AiOutlineSend
            onClick={messageHandler}
            className="w-6 h-6 mr-2 cursor-pointer text-blue-100"
          />
        </div>
      </div>
    </div>
  );
}
