import mongoose from "mongoose";

let isConnectiond: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    return console.log("missing MONGODB_URI");
  }

  if (isConnectiond) {
    return;
  }

  try {
    mongoose.connect(process.env.MONGODB_URI, {
      dbName: "devOverflow",
    });

    isConnectiond = true;
    console.log("mongodb is connected");
  } catch (error) {
    console.log("mongodb connection error", error);
  }
};
