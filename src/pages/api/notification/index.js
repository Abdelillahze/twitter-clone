import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Notification from "@/models/notificationModel";
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
        const notifications = await Notification.find({ to: me._id })
          .populate([
            { path: "to", model: "User" },
            { path: "author", model: "User" },
          ])
          .sort({ createdAt: -1 });

        return res.status(200).json({ notifications });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Bad Request" });
  }
}

export const createNotification = async (type, author, to, tweet) => {
  try {
    await Notification.create({ type, author, to, tweet });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Bad Request" });
  }
};
