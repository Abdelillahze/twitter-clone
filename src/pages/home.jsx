import User from "../models/userModel";
import { getServerSession } from "next-auth/next";
import Section from "@/components/Section";
import useSWR from "swr";
import Loading from "@/components/Loading";
import axios from "axios";
import { authOptions } from "./api/auth/[...nextauth]";
import { useState } from "react";

const fetcher = (...args) => axios.get(...args).then((res) => res.data);

export default function Home({ user }) {
  const [type, setType] = useState("foryou");

  const { data, error, mutate } = useSWR(`/api/tweets/0/${type}`, fetcher, {
    refreshInterval: 5000,
  });

  const changePostsType = (str) => {
    setType(str);
  };

  return (
    <div className="section relative w-full sm:w-10/12 lg:w-7/12 xl:w-6/12 min-h-[100vh] h-full border border-transparent border-r-borderColor">
      {data ? (
        <Section
          user={user}
          tweets={data.data}
          refresh={mutate}
          type={type}
          changePostsType={changePostsType}
        />
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

  const user = await User.findOne({ email: session.user.email });

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
