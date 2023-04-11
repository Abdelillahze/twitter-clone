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
      case "GET": {
        const conversationId = req.query.conversationId;
        const conversation = await Conversation.findById(
          conversationId
        ).populate([
          { path: "members", model: "User" },
          { path: "messages", model: "Message" },
        ]);

        if (
          !conversation.members.find(
            (member) => member._id.toString() === me._id.toString()
          )
        )
          return res.status(403).end();

        return res.status(200).json({ conversation });
      }
      case "DELETE": {
        const conversationId = req.body.conversationId;
        const conversation = await Conversation.findByIdAndDelete(
          conversationId
        );

        await Message.deleteMany({ conversation: conversation._id });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Bad Request" });
  }
}
