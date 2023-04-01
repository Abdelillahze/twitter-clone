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
      res.json(403).json({ error: "la" });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      signOut();
      res.json(403).json({ error: "la" });
    }
    switch (req.method) {
      case "GET": {
        const tweets = await Tweet.find().populate("author likes retweets");

        return res.status(200).json({ tweets });
      }
      case "POST": {
        const text = req.body.text;
        const tweet = await Tweet.create({ text, author: user });

        user.tweets.push(tweet);
        user.save();

        return res.status(201).json({ tweet });
      }
    }
  } catch (err) {
    console.log(err);
  }
}
