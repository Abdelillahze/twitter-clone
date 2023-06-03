import { getServerSession } from "next-auth/next";
import User from "@/models/userModel";
import Loading from "@/components/Loading";
import TweetDetails from "@/components/TweetDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";

const fetcher = (...args) => axios.get(...args).then((res) => res.data);

export default function TweetList({ user, tweet, Emojis }) {
  const router = useRouter();
  const tweetId = router.query.tweetId;
  const { data, error, mutate } = useSWR(`/api/tweet/${tweetId}`, fetcher, {
    refreshInterval: 1000,
  });
  return (
    <div className="relative bg-black-100 h-full xs:w-full sm:w-10/12 lg:w-7/12 xl:w-6/12 min-h-[100vh] border border-transparent border-r-borderColor">
      {data ? (
        <TweetDetails
          Emojis={Emojis}
          user={user}
          tweet={data.tweet}
          refresh={mutate}
        />
      ) : (
        <Loading className={"mx-auto mt-8"} />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { res } = context;
  const session = await getServerSession(context.req, context.res, authOptions);

  const response = await fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data");
  const data = await response.json();

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permenant: false,
      },
    };
  }

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    res.setHeader("Set-Cookie", ["next-auth.session-token="]);
    return {
      redirect: {
        destination: "/signin",
        permenant: false,
      },
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      Emojis: data,
    },
  };
}
