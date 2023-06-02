import { authOptions } from "../api/auth/[...nextauth]";
import User from "@/models/userModel";
import { getServerSession } from "next-auth/next";
import useSWR from "swr";
import axios from "axios";
import Notification from "@/components/Notification";

const fetcher = (...args) => axios.get(...args).then((res) => res.data);

const Notifications = ({ user }) => {
  const { data, error, isLoading } = useSWR("/api/notification", fetcher);

  console.log(data);
  return (
    <>
      <section className="section bg-black-100 relative w-full sm:w-10/12 lg:w-7/12 xl:w-6/12 min-h-[100vh] h-full border border-transparent border-r-borderColor">
        <div className="p-4 border-b border-b-borderColor">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <div>
          {!isLoading &&
            data.notifications.map((notification) => {
              return <Notification data={notification} />;
            })}
        </div>
      </section>
    </>
  );
};

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

export default Notifications;
