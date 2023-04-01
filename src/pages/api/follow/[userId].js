import { getServerSession } from "next-auth/next";
import User from "@/models/userModel";

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  switch (req.method) {
    case "GET": {
      const userId = req.query.userId;
      if (!session) {
        return res.status(403).json("la");
      }
      const me = await User.findOne({ email: session.user.email });
      const user = await User.findOne({ _id: userId });

      if (me.following.includes(user._id)) {
        return res.status(200).json({ following: true });
      } else {
        return res.status(200).json({ following: false });
      }
    }
  }
}
