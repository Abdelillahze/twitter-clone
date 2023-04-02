import Tweet from "@/models/tweetModel";
import Like from "@/models/likeModel";
import Comment from "@/models/commentModel";
import User from "@/models/userModel";
import { getServerSession, signOut } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const tweetId = req.query.tweetId;
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
    const isLiked = await Like.findOne({ author: me, tweet: tweet._id });
    switch (req.method) {
      case "GET": {
        const likes = await Like.find({ tweet: tweet._id });

        return res.status(200).json({ likes });
      }
      case "PATCH": {
        if (isLiked) {
          tweet.likes = tweet.likes.filter(
            (like) => like.toString() !== isLiked._id.toString()
          );
          isLiked.deleteOne();
          tweet.save();
          return res.status(204).end();
        } else {
          const like = await Like.create({ author: me, tweet });
          tweet.likes.push(like);
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
