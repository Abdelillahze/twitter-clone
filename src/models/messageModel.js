import { Schema, models, model } from "mongoose";

const messageSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  text: String,
  image: String,
  video: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  reactions: [
    {
      type: String,
    },
  ],
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
  },
});

const Message = models.Message || model("Message", messageSchema);

export default Message;
