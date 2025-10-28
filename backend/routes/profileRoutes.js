import express from "express";
import User from "../models/User.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Xem thông tin cá nhân
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ✅ Cập nhật thông tin cá nhân
router.put("/", verifyToken, async (req, res) => {
  try {
    const { name, gitname, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, gitname, avatar },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Cập nhật thành công",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
