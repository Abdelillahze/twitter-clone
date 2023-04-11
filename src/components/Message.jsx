export default function Message({ message, isMe }) {
  return (
    <div className={``}>
      <p
        className={`${
          isMe ? "bg-blue-100 ml-auto" : "bg-p"
        } text-white-100 px-4 w-fit py-1.5 rounded-full mb-2 max-w-sm whitespace-pre-wrap break-all`}
      >
        {message.text}
      </p>
    </div>
  );
}
