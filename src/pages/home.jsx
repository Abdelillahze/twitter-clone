import User from "../models/userModel";
import { getServerSession } from "next-auth/next";
import Section from "@/components/Section";
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import { authOptions } from "./api/auth/[...nextauth]";
import { useState } from "react";

const fetcher = (...args) => axios.get(...args).then((res) => res.data);

export default function Home({ user }) {
  const [type, setType] = useState("foryou");
  const limit = 10;

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.data.length === 0) {
      return null;
    }
    pageIndex = pageIndex + 1;
    return `/api/tweets/${type}?page=${pageIndex}&limit=${limit}`;
  };
  const { data, isValidating, mutate, size, setSize } = useSWRInfinite(
    getKey,
    fetcher,
    { refreshInterval: 1000, revalidateAll: true }
  );
  const loading = !((data && data.length === size) || !isValidating);
  const addSearch = (size) => {
    setSize(size + 1);
  };

  const changePostsType = (str) => {
    setType(str);
  };
  return (
    <div className="section bg-black-100 relative xs:w-full sm:w-10/12 lg:w-7/12 xl:w-6/12 min-h-[100vh] h-full border border-transparent border-r-borderColor">
      {
        <Section
          loading={loading}
          user={user}
          data={data}
          refresh={mutate}
          size={size}
          type={type}
          changePostsType={changePostsType}
          addSearch={addSearch}
        />
      }
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
