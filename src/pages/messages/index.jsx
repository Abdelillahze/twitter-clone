import { getServerSession } from "next-auth";
import User from "../../models/userModel";
import { authOptions } from "../api/auth/[...nextauth]";
import ConversationList from "@/components/ConversationList";
import Sidebar from "@/components/Sidebar";
import useSWR from "swr";
import axios from "axios";

const fetcher = (...args) => axios.get(...args).then((res) => res.data);

export default function Page({ user }) {
  const { data, error, isLoading } = useSWR("/api/conversation", fetcher);

  return (
    <div className="section overflow-hidden max-h-screen bg-black-100 relative w-full sm:w-10/12 lg:w-10/12 xl:w9/12 min-h-[100vh] border border-transparent border-r-borderColor">
      <ConversationList
        user={user}
        conversations={data?.conversations}
        loading={isLoading}
      />
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

Page.getLayout = (page) => {
  return (
    <>
      <Sidebar user={page.props.user} />
      {page}
    </>
  );
};
