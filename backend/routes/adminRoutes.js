// routes/adminRoutes.js
import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Route test quyền admin
router.get("/check", verifyToken, adminMiddleware, (req, res) => {
  res.json({ success: true, message: "Chào mừng Admin hợp lệ!" });
});

// Lấy danh sách tất cả người dùng
router.get("/users", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // không trả password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng" });
  }
});

export default router;
