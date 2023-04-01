import { Schema, models, model } from "mongoose";

const tweetSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  retweets: [
    {
      type: Schema.Types.ObjectId,
      refe: "Retweet",
    },
  ],
});

const tweetModel = models.Tweet || model("Tweet", tweetSchema);

export default tweetModel;
