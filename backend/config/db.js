// backend/config/db.js
import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URI not provided");
  await mongoose.connect(uri, {
    // mongoose v6+ uses sensible defaults; options optional
  });
  console.log("✅ MongoDB connected");
}
