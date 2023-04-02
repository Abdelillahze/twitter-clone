import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import User from "@/models/userModel";
import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite";
import ProfileHead from "@/components/ProfileHead";
import ProfileSection from "@/components/ProfileSection";
import Loading from "@/components/Loading";

const fetcher = (...args) => axios.get(...args).then((res) => res.data);

export default function Profile({ user }) {
  const router = useRouter();
  const username = router.query.username;
  const limit = 10;
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.data.length) {
      return null;
    }
    pageIndex = pageIndex + 1;
    return `/api/user/${username}?page=${pageIndex}&limit=${limit}`;
  };
  const { data, error, isValidating, mutate, size, setSize } = useSWRInfinite(
    getKey,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  const addSearch = () => {
    setSize(size + 1);
  };

  const loading = isValidating && data?.length !== size;
  if (error?.response.status === 404) {
    router.push("/404");
  }
  return (
    <div className="relative w-full sm:w-10/12 lg:w-7/12 xl:w-6/12 min-h-[100vh] h-full border border-transparent border-r-borderColor">
      {data ? (
        <>
          <ProfileHead fetchedUser={data[0].fetchedUser} />
          <ProfileSection
            user={user}
            fetchedUser={data[0].fetchedUser}
            data={data}
            me={data[0].me}
            refresh={mutate}
            loading={loading}
            addSearch={addSearch}
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
    res.setHeader("Set-Cookie", ["next-auth.session-token="], {
      httpOnly: true,
      maxAge: 0,
    });
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
