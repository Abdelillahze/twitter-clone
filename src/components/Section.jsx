import { useEffect, useRef } from "react";
import SectionHead from "./SectionHead";
import Tweet from "./Tweet";
import TweetMaker from "./TweetMaker";
import Loading from "./Loading";

export default function Section({
  user,
  data,
  refresh,
  type,
  loading,
  changePostsType,
  addSearch,
}) {
  const section = useRef(null);

  useEffect(() => {
    document.addEventListener("scroll", (event) => {
      const end = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY === end) {
        addSearch();
      }
    });
  }, []);

  const tweets = [];
  for (let i = 0; i < data?.length; i++) {
    tweets.push(
      data[i].data.map((tweet) => {
        return (
          <Tweet user={user} refresh={refresh} key={tweet._id} tweet={tweet} />
        );
      })
    );
  }

  return (
    <div ref={section}>
      <SectionHead user={user} type={type} changePostsType={changePostsType} />
      <TweetMaker user={user} />
      {!loading && tweets?.length === 0 && (
        <h1 className="text-center mt-4">No Tweets :(</h1>
      )}
      {tweets}
      {loading && <Loading className={"mx-auto my-4"} />}
    </div>
  );
}
