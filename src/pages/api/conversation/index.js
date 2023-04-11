import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
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
        const conversations = await Conversation.find({
          members: { $in: me._id },
        }).populate([
          { path: "members", model: "User" },
          { path: "messages", model: "Message" },
        ]);

        return res.status(200).json({ conversations });
      }
      case "POST": {
        const { usersId } = req.body;
        let admins = [];

        if (usersId.length === 1) {
          const isConversation = await Conversation.findOne({
            members: [me._id, ...usersId],
          });

          if (isConversation) {
            return res.status(200).end();
          }
        }

        if (usersId.length > 1) {
          admins = me._id;
        }

        const conversation = await Conversation.create({
          members: [me._id, ...usersId],
          admins,
        });

        return res.status(201).json({ conversation });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Bad Request" });
  }
}
