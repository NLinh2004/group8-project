import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// === ROUTES ===
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import forgotPasswordRoutes from "./routes/forgotPasswordRoutes.js";
import userRoutes from "./routes/user.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// === MIDDLEWARE ===
app.use(cors({ 
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true 
}));
app.use(express.json());

// === KẾT NỐI MONGODB ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Kết nối MongoDB thành công"))
  .catch((err) => console.error("Lỗi MongoDB:", err));

// === TEST ROUTE ===
app.get("/", (req, res) => res.send("Server đang chạy đúng"));

// === ROUTES – SỬA LỖI GHI ĐÈ ===
app.use("/api/auth", authRoutes);                    // Login, Signup, Refresh, Logout
app.use("/api/profile", profileRoutes);              // GET/PUT profile
app.use("/api/admin", adminRoutes);                  // Quản lý user (admin)
app.use("/api/auth", forgotPasswordRoutes);          // Quên mật khẩu
app.use("/api/users", userRoutes);                   // Danh sách user (moderator/admin)
app.use("/api/upload", uploadRoutes);                // Upload avatar

// === KHỞI ĐỘNG SERVER ===
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});