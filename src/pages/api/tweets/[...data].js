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
        const limit = req.query.limit;
        const type = req.query.data[0];
        const search = Math.max(0, req.query.page - 1);
        let options = {};
        if (type === "following") {
          options = {
            author: { $in: user.following },
          };
        }

        const tweets = await Tweet.find(options)
          .populate([
            {
              path: "author",
              model: "User",
            },
            {
              path: "likes",
              model: "Like",
            },
            {
              path: "retweets",
              model: "Retweet",
            },
          ])
          .limit(limit)
          .skip(limit * search)
          .sort({ createdAt: -1 });
        const retweets = await Retweet.find(options)
          .populate([
            {
              path: "author",
              model: "User",
            },
            {
              path: "tweet",
              model: "Tweet",
            },
            {
              path: "tweet",
              populate: {
                path: "author",
                model: "User",
              },
            },
            {
              path: "tweet",
              populate: {
                path: "likes",
                model: "Like",
              },
            },
          ])
          .limit(limit)
          .skip(limit * search)
          .sort({ createdAt: -1 });
        const data = [...tweets, ...retweets].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          if (dateA < dateB) {
            return 1;
          }
          if (dateA > dateB) {
            return -1;
          }
          return 0;
        });
        return res.status(200).json({ data });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Bad Request" });
  }
}
