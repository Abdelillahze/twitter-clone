import Tweet from "@/models/tweetModel";
import Comment from "@/models/commentModel";
import User from "@/models/userModel";
import { getServerSession, signOut } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const tweetId = req.query.tweetId;
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(403).json({ error: "la" });
    }
    let tweet = await Tweet.findById(tweetId).populate("author");
    if (!tweet) {
      tweet = await Comment.findById(tweetId).populate("author");
      if (!tweet) {
        return res.status(404).json({ error: "la" });
      }
    }
    const me = await User.findOne({ email: session.user.email });
    if (!me) {
      signOut();
      res.status(403).json({ error: "la" });
    }
    switch (req.method) {
      case "GET": {
        const comments = await Comment.find({ tweet: tweet._id });

        return res.status(200).json({ comments });
      }
      case "PATCH": {
        const { text, image, video } = req.body;
        const comment = await Comment.create({
          author: me,
          tweet,
          text,
          image,
          video,
        });
        tweet.comments.push(comment);
        tweet.save();
        return res.status(204).end();
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Bad Request" });
  }
}
