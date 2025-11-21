// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });

// prevent OverwriteModelError on hot reload
export default mongoose.models.User || mongoose.model("User", userSchema);
