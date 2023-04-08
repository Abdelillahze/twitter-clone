import { Schema, models, model } from "mongoose";

const likesSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  tweet: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
  },
});

const Like = models.Like || model("Like", likesSchema);

export default Like;
