import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: String,
  username: {
    type: String,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  image: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  verified: {
    type: Boolean,
    default: false,
  },
  tweets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
  ],
  retweets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Retweet",
    },
  ],
});

const User = models.User || model("User", userSchema);

export default User;
