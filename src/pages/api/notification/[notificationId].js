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
      case "PATCH": {
        const notificationId = req.query.notificationId;
        await Notification.findByIdAndUpdate(notificationId, { readed: true });

        return res.status(204).end();
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Bad Request" });
  }
}
