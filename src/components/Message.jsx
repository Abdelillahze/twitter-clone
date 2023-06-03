import { forwardRef } from "react";

export default forwardRef(function Message({ message, isMe }, ref) {
  return (
    <div ref={ref} className={`mb-2`}>
      <p
        className={`${
          isMe ? "bg-blue-100 ml-auto" : "bg-p"
        } text-white-100 px-4 w-fit py-1.5 rounded-full max-w-sm whitespace-pre-wrap break-all`}
      >
        {message.text}
      </p>
    </div>
  );
});
