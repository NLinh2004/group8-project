// routes/forgotPasswordRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/reset-password/:token
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới" });

    // verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // tìm user
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    // cập nhật mật khẩu (lưu ý bạn nên hash password trước khi lưu)
    user.password = password; // hoặc bcrypt.hashSync(password, 10)
    await user.save();

    res.json({ message: "✅ Mật khẩu đã được cập nhật thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
