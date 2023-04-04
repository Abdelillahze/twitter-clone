import { connectDb } from "@/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/userModel";

const createUsername = (name) => {
  const specialsCharacters = "!@#$%^&*()_+=- ".split("");
  let characters = name.split("");

  for (let i = 0; i < characters.length; i++) {
    const character = characters[i];
    if (specialsCharacters.includes(character)) {
      characters[i] = "";
    }
  }

  return characters.join("");
};

connectDb();
export const authOptions = {
  session: {
    jwt: true,
  },
  jwt: {
    sercret: "slm",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        const isUser = await User.findOne({ email: user.email });

        if (isUser) {
          return true;
        }

        await User.create({
          ...user,
          username: createUsername(user.name),
          image: user.image.replace(/=.+/g, "=s500-c"),
        });
        return true;
      } catch (err) {
        console.log(err);
      }
    },
  },
};

export default NextAuth(authOptions);
