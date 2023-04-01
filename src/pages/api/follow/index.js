import { getServerSession } from "next-auth/next";
import User from "@/models/userModel";

import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  switch (req.method) {
    case "PATCH":
      {
        try {
          const userId = req.body.userId;
          if (!session) {
            return res.status(403).json("la");
          }
          const me = await User.findOne({ email: session.user.email });
          const user = await User.findOne({ _id: userId });

          if (me.following.includes(user._id)) {
            me.following = me.following.filter(
              (acc) => acc.toString() != user._id.toString()
            );
            user.followers = user.followers.filter(
              (acc) => acc.toString() != me._id.toString()
            );
          } else {
            me.following.push(user);
            user.followers.push(me);
          }

          await me.save();
          await user.save();

          return res.status(204).end();
        } catch (err) {
          return res.status(400).json({ error: "Bad Request" });
        }
      }
      break;
  }
}
