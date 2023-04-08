import { Schema, models, model } from "mongoose";
import Like from "./likeModel";
import Retweet from "./retweetModel";

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  image: String,
  video: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  text: {
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
      ref: "Retweet",
    },
  ],
  tweet: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
  },
});

const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;
