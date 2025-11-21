// backend/models/Habit.js
import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  notes: { type: String, default: "" },
  doneToday: { type: Boolean, default: false },
  streak: { type: Number, default: 0 },
  lastDoneAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.models.Habit || mongoose.model("Habit", habitSchema);
