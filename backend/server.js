import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Lỗi MongoDB:", err));

// ✅ Test route
app.get("/", (req, res) => res.send("✅ Server đang chạy đúng"));

// ✅ Routes
app.use("/api/auth", authRoutes);        // Auth
app.use("/api/profile", profileRoutes);  // Profile

// ✅ Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
