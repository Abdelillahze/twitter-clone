import Tweet from "@/models/tweetModel";
import Like from "@/models/likeModel";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET": {
        const tweetId = req.query.tweetId;
        const tweet = await Tweet.findById(tweetId).populate("author likes");

        res.status(200).json({ tweet });
      }
    }
  } catch (err) {
    console.log(err);
  }
}
