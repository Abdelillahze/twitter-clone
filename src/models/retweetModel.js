import { Schema, models, model } from "mongoose";

const retweetSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  tweet: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
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
});

const retweetModel = models.Retweet || model("Retweet", retweetSchema);

export default retweetModel;
