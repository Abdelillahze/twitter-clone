import { Schema, models, model } from "mongoose";

const conversationSchema = new Schema({
  name: {
    type: String,
    default: () => null,
  },
  image: {
    type: String,
    default: () => null,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

const Conversation =
  models.Conversation || model("Conversation", conversationSchema);

export default Conversation;
