import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import Conversation from "@/models/converstationModel";
import Message from "@/models/messageModel";
import User from "@/models/userModel";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(403).json({ error: "la" });
    }
    const me = await User.findOne({ email: session.user.email });
    if (!me) {
      return res.status(403).json({ error: "la" });
    }
    switch (req.method) {
      case "POST": {
        const { input: text, image, video } = req.body;
        const conversationId = req.query.conversationId;
        const conversation = await Conversation.findById(conversationId);
        const message = await Message.create({
          author: me,
          text: text.trim(),
          image,
          video,
          conversation,
        });

        conversation.messages.push(message);
        conversation.save();
        return res.status(201).end();
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Bad Request" });
  }
}
