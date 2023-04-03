import Tweet from "@/models/tweetModel";
import Like from "@/models/likeModel";
import User from "@/models/userModel";
import Retweet from "@/models/retweetModel";
import Comment from "@/models/commentModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "DELETE": {
        const tweetId = req.query.tweetId;
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
          return res.status(403).json({ error: "la" });
        }
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
          return res.status(403).json({ error: "la" });
        }
        let tweet = await Tweet.findOne({
          _id: tweetId,
          author: user._id,
        });
        if (!tweet) {
          tweet = await Comment.findOne({
            _id: tweetId,
            author: user._id,
          });
          if (!tweet) {
            return res.status(404).json({ error: "la" });
          }
        }

        await Like.deleteMany({ tweet: tweet._id });
        await Retweet.deleteMany({ tweet: tweet._id });
        await Comment.deleteMany({ tweet: tweet._id });

        tweet.deleteOne();
        return res.status(204).end();
      }
      case "GET": {
        const tweetId = req.query.tweetId;
        let tweet = await Tweet.findById(tweetId).populate([
          { path: "author", model: "User" },
          { path: "likes", model: "Like" },
          { path: "retweets", model: "Retweet" },
          {
            path: "comments",
            populate: {
              path: "author",
              model: "User",
            },
          },
          {
            path: "comments",
            populate: {
              path: "likes",
              model: "Like",
            },
          },
          {
            path: "comments",
            populate: {
              path: "retweets",
              model: "Retweet",
            },
          },
        ]);

        if (!tweet) {
          tweet = await Comment.findById(tweetId).populate([
            { path: "author", model: "User" },
            { path: "likes", model: "Like" },
            { path: "retweets", model: "Retweet" },
            {
              path: "comments",
              populate: {
                path: "author",
                model: "User",
              },
            },
            {
              path: "comments",
              populate: {
                path: "likes",
                model: "Like",
              },
            },
            {
              path: "comments",
              populate: {
                path: "retweets",
                model: "Retweet",
              },
            },
          ]);
          if (!tweet) {
            return res.status(404).json({ error: "la" });
          }
        }

        res.status(200).json({ tweet });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Bad Request" });
  }
}
