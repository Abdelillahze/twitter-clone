import { getServerSession } from "next-auth";
import User from "@/models/userModel";
import { authOptions } from "../../api/auth/[...nextauth]";
import ConversationList from "@/components/ConversationList";
import Sidebar from "@/components/Sidebar";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import ConversationMessages from "@/components/ConversationMessages";
import Loading from "@/components/Loading";

const fetcher = (...args) => axios.get(...args).then((res) => res.data);

export default function Page({ user }) {
  const router = useRouter();
  const {
    data: cons,
    error: errorS,
    isLoading: isLoadingS,
  } = useSWR(`/api/conversation`, fetcher);
  const {
    data: con,
    error,
    mutate,
    isLoading,
  } = useSWR(`/api/conversation/${router.query.conversationId}`, fetcher);

  return (
    <div className="flex overflow-hidden section max-h-screen bg-black-100 relative w-full sm:w-10/12 lg:w-10/12 xl:w9/12 min-h-[100vh] border border-transparent border-r-borderColor">
      <ConversationList
        className="hidden lg:block"
        user={user}
        conversations={cons?.conversations}
        loading={isLoadingS}
      />
      {con ? (
        <ConversationMessages
          refresh={mutate}
          me={user}
          conversation={con.conversation}
        />
      ) : (
        <Loading className={"mx-auto mt-4"} />
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

Page.getLayout = (page) => {
  return (
    <>
      <Sidebar user={page.props.user} />
      {page}
    </>
  );
};
