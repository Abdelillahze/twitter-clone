import User from "@/models/userModel";
import Retweet from "@/models/retweetModel";
import Tweet from "@/models/tweetModel";
import Like from "@/models/likeModel";
import { getServerSession, signOut } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    let me = false;

    if (!session) {
      res.status(403).json({ error: "la" });
    }

    const username = req.query.username;
    const fetchedUser = await User.findOne({ username }).populate([
      {
        path: "tweets",
        populate: {
          path: "author",
          model: "User",
        },
      },
      {
        path: "tweets",
        populate: {
          path: "likes",
          model: "Like",
        },
      },
      {
        path: "tweets",
        populate: {
          path: "retweets",
          model: "Retweet",
        },
      },
    ]);

    if (!fetchedUser) {
      return res.status(404).json({ error: "la" });
    }

    const user = await User.findOne({ username });

    if (session) {
      if (session.user.email === fetchedUser.email) {
        me = true;
      }
    }

    if (!user) {
      return signOut();
    }

    const limit = 10;
    const search = req.query.search;
    const tweets = await Tweet.find({ author: user._id })
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
      .skip(limit * search);
    const retweets = await Retweet.find({ author: user._id })
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
      .skip(limit * search);
    const data = [...tweets, ...retweets].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }
      return 0;
    });

    res.status(200).json({ fetchedUser, data, me });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Bad Request" });
  }
}
