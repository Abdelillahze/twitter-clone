import User from "@/models/userModel";
import { getServerSession, signOut } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(403).json({ error: "la" });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      signOut();
      res.status(403).json({ error: "la" });
    }
    switch (req.method) {
      case "GET": {
        return res.status(200).json({ user });
      }
      case "PATCH": {
        const { name, bio } = req.body;

        user.name = name;
        user.bio = bio;
        user.save();
        return res.status(204).end();
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Bad Request" });
  }
}
