import mongoose from "mongoose";

export const connectDb = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI);

  console.log(`connected ${connection.connection.host}`);
};
