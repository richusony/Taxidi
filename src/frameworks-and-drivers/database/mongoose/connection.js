import mongoose from "mongoose";

export const connectMongoDB = async (url) => {
  try {
    if (!url) {
      throw new Error("MONGODB_URI IS NOT AVAILABLE !!");
    }
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  } 
};
