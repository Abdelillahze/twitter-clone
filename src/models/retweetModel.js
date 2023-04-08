import { Schema, models, model } from "mongoose";

const retweetSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  tweet: {
    type: Schema.Types.ObjectId,
    refPath: "model_type",
  },
  model_type: {
    type: String,
    enum: ["Comment", "Tweet"],
    required: true,
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

const Retweet = models.Retweet || model("Retweet", retweetSchema);

export default Retweet;
