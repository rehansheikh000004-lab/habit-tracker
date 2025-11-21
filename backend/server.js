// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
app.use(express.json());

// CORS - allow frontend OR allow all while testing
const FRONTEND = process.env.FRONTEND_URL || "";
app.use(cors({
  origin: FRONTEND || true,
  credentials: true
}));

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI missing in .env");
  process.exit(1);
}

// Connect DB then start
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.use("/api/auth", authRoutes);
    app.use("/api/habits", habitRoutes);

    app.get("/", (req, res) => res.send("Habit Tracker API"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("Startup DB error", err);
    process.exit(1);
  });
