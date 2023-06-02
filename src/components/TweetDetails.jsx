import TweetDetailsHead from "./TweetDetailsHead";
import TweetDetailsSection from "./TweetDetailsSection";

export default function TweetDetails({ user, tweet, refresh }) {
  return (
    <div className="relative w-full section">
      <TweetDetailsHead user={user} />
      <TweetDetailsSection user={user} tweet={tweet} refresh={refresh} />
    </div>
  );
}
