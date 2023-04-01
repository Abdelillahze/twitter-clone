import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import User from "@/models/userModel";
import { useRouter } from "next/router";
import useSWR from "swr";
import ProfileHead from "@/components/ProfileHead";
import ProfileSection from "@/components/ProfileSection";
import Loading from "@/components/Loading";

const fetcher = (...args) => axios.get(...args).then((res) => res.data);

export default function Profile({ user }) {
  const router = useRouter();
  const username = router.query.username;
  const { data, error, mutate } = useSWR(`/api/user/${username}/0`, fetcher);
  if (error?.response.status === 404) {
    router.push("/404");
  }
  return (
    <div className="relative w-full sm:w-10/12 lg:w-7/12 xl:w-6/12 min-h-[100vh] h-full border border-transparent border-r-borderColor">
      {data ? (
        <>
          <ProfileHead fetchedUser={data.fetchedUser} />
          <ProfileSection
            user={user}
            fetchedUser={data.fetchedUser}
            tweets={data.data}
            me={data.me}
            refresh={mutate}
          />
        </>
      ) : (
        <Loading className={"mx-auto mt-8"} />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/signin`,
        permenant: false,
      },
    };
  }

  const user = await User.findOne({ email: session.user.email }).populate("");

  if (!user) {
    res.setHeader("Set-Cookie", ["next-auth.session-token="]);
    return {
      redirect: {
        destination: `/signin`,
        permenant: false,
      },
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}
