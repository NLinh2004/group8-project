import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/user.js";

import User from "./models/User.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Lỗi MongoDB:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Tạo admin mặc định (chạy 1 lần)
(async () => {
  const adminEmail = "admin@example.com";
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: adminEmail,
      gitname: "admin",
      password: hashed,
      role: "admin",
    });
    console.log("👑 TẠO ADMIN THÀNH CÔNG: admin@example.com / admin123");
  }
})();

// Test route
app.get("/", (req, res) => res.send("Server đang chạy đúng 🚀"));

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
