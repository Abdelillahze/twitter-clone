import { IoMdClose } from "react-icons/io";
import Image from "next/image";

export default function ImageView({ image }) {
  return (
    <div
      onClick={() => {
        document.getElementById("portal").style.display = "none";
      }}
      className="relative w-full h-full text-white-100 bg-black-70 grid place-items-center"
    >
      <IoMdClose className="absolute top-6 left-6 rounded-full w-10 h-10 cursor-pointer px-2 py-2 transition-colors hover:bg-white-10" />
      <Image
        quality="100"
        className="w-80 h-80 rounded-full"
        src={image.replace(/=.+/g, "=s500-c")}
        alt="pfp"
        width="500"
        height="500"
      />
    </div>
  );
}
