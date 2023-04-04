import { useEffect, useRef, createRef, useState, useCallback } from "react";
import SectionHead from "./SectionHead";
import Tweet from "./Tweet";
import TweetMaker from "./TweetMaker";
import Loading from "./Loading";

export default function Section({
  user,
  data,
  refresh,
  type,
  size,
  loading,
  changePostsType,
  addSearch,
}) {
  const section = useRef(null);
  const observer = useRef(null);

  const lastTweetRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        addSearch(size);
      }
    });
    if (node) observer.current.observe(node);
  });

  const tweets = [];
  for (let i = 0; i < data?.length; i++) {
    tweets.push(
      data[i].data.map((tweet, index) => {
        let last = false;
        if (i + 1 === data.length && index + 1 === data[i].data.length) {
          last = true;
        }
        return (
          <Tweet
            ref={last ? lastTweetRef : null}
            user={user}
            refresh={refresh}
            key={tweet._id}
            tweet={tweet}
          />
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
