import { Schema, models, model } from "mongoose";

const notificationSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
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
  readed: {
    type: Boolean,
    default: () => false,
  },
});

const Notification =
  models.Notification || model("Notification", notificationSchema);

export default Notification;
