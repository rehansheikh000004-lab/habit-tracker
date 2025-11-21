// backend/routes/habits.js
import express from "express";
import Habit from "../models/Habit.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/habits  (list user's habits)
router.get("/", auth, async (req, res) => {
  const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(habits);
});

// POST /api/habits  (create)
router.post("/", auth, async (req, res) => {
  const { title, notes } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });
  const h = await Habit.create({ userId: req.userId, title: title.trim(), notes: notes || "" });
  res.status(201).json(h);
});

// PUT /api/habits/:id  (update title/notes)
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { title, notes } = req.body;
  const updated = await Habit.findOneAndUpdate({ _id: id, userId: req.userId }, { title, notes }, { new: true });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

// POST /api/habits/:id/toggle  (mark done today; simple streak logic)
router.post("/:id/toggle", auth, async (req, res) => {
  const { id } = req.params;
  const habit = await Habit.findOne({ _id: id, userId: req.userId });
  if (!habit) return res.status(404).json({ message: "Not found" });

  const now = new Date();
  const last = habit.lastDoneAt ? new Date(habit.lastDoneAt) : null;

  // if it was done today already -> undo doneToday and decrease streak if desired
  if (habit.doneToday) {
    habit.doneToday = false;
    // do not reduce streak to keep simple — optional: reduce
  } else {
    // Mark done today
    habit.doneToday = true;
    // increase streak if last done was yesterday; otherwise reset to 1
    if (last) {
      const diffDays = Math.floor((new Date(now.toDateString()) - new Date(last.toDateString())) / (1000*60*60*24));
      if (diffDays === 1) habit.streak = (habit.streak || 0) + 1;
      else if (diffDays === 0) { /* already counted today? handled earlier */ }
      else habit.streak = 1;
    } else {
      habit.streak = 1;
    }
    habit.lastDoneAt = now;
  }

  await habit.save();
  res.json(habit);
});

// DELETE /api/habits/:id
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const deleted = await Habit.findOneAndDelete({ _id: id, userId: req.userId });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
});

export default router;
