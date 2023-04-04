import Tweet from "@/models/tweetModel";
import User from "@/models/userModel";
import Like from "@/models/likeModel";
import Retweet from "@/models/retweetModel";
import { getServerSession, signOut } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(403).json({ error: "la" });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      signOut();
      res.status(403).json({ error: "la" });
    }
    switch (req.method) {
      case "GET": {
        const tweets = await Tweet.find().populate("author likes retweets");

        return res.status(200).json({ tweets });
      }
      case "POST": {
        const { text, image, video } = req.body;
        const tweet = await Tweet.create({ text, author: user, image, video });

        user.tweets.push(tweet);
        user.save();

        return res.status(201).json({ tweet });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Bad Request" });
  }
}
