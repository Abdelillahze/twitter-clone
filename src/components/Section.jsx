import SectionHead from "./SectionHead";
import Tweet from "./Tweet";
import TweetMaker from "./TweetMaker";

export default function Section({
  user,
  tweets,
  refresh,
  type,
  changePostsType,
}) {
  return (
    <>
      <SectionHead user={user} type={type} changePostsType={changePostsType} />
      <TweetMaker user={user} />
      {tweets.map((tweet) => {
        return (
          <Tweet user={user} refresh={refresh} key={tweet._id} tweet={tweet} />
        );
      })}
    </>
  );
}
