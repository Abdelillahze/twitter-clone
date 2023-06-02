import Tweet from "@/models/tweetModel";
import Retweet from "@/models/retweetModel";
import User from "@/models/userModel";
import Comment from "@/models/commentModel";
import { getServerSession, signOut } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { createNotification } from "../../notification";

export default async function handler(req, res) {
  try {
    const tweetId = req.query.tweetId;
    const type = req.query.type;
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.json(403).json({ error: "la" });
    }
    let tweet = await Tweet.findById(tweetId).populate("author");
    if (!tweet) {
      tweet = await Comment.findById(tweetId).populate("author");

      if (!tweet) {
        return res.json(404).json({ error: "la" });
      }
    }
    const me = await User.findOne({ email: session.user.email });
    if (!me) {
      signOut();
      res.json(403).json({ error: "la" });
    }
    const isRetweeted = await Retweet.findOne({ author: me, tweet: tweet._id });
    switch (req.method) {
      case "GET": {
        const retweets = await Retweet.find({ tweet: tweet._id });

        return res.status(200).json({ retweets });
      }
      case "PATCH": {
        if (isRetweeted) {
          tweet.retweets = tweet.retweets.filter(
            (retweet) => retweet.toString() !== isRetweeted._id.toString()
          );
          isRetweeted.deleteOne();
          tweet.save();
          return res.status(204).end();
        } else {
          const retweet = await Retweet.create({
            author: me,
            tweet,
            model_type: type,
          });
          createNotification("retweet", me, tweet.author, tweet);
          tweet.retweets.push(retweet);
          me.retweets.push(retweet);
          tweet.save();
          return res.status(204).end();
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Bad Request" });
  }
}
