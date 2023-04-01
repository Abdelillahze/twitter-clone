import { Schema, models, model } from "mongoose";

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  body: {
    type: String,
    required: true,
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

const commentModel = models.Comment || model("Comment", commentSchema);

export default commentModel;
