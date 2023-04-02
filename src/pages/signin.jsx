import { useEffect } from "react";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
      return;
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="w-full py-4 min-h-[100vh] bg-black-100">
        <Loading className="mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-black-100 min-h-[100vh] grid place-items-center">
      <div className="h-full w-fit mx-auto flex flex-col items-center justify-center">
        <Image
          className="mb-6"
          src="/twitter-logo.webp"
          alt="twitter logo"
          width="150"
          height="100"
        />

        <button
          onClick={signIn}
          className="text-white-100 flex items-center border border-white-100 px-4 py-2 rounded"
        >
          <Image
            className="mr-2"
            src="/google-logo.webp"
            alt="google logo"
            width="30"
            height="30"
          />
          Sign In with google
        </button>
      </div>
    </div>
  );
}

SignIn.getLayout = (page) => {
  return page;
};
