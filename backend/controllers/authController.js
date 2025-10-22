import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Đăng ký (Sign Up)
router.post("/register", async (req, res) => {
  try {
    const { name, email, gitname, password, role } = req.body;

    // Kiểm tra nhập thiếu
    if (!name || !email || !gitname || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    // Kiểm tra trùng email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await User.create({
      name,
      email,
      gitname,
      password: hashedPassword,
      role: role || "user",
    });

    // Tạo JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công!",
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          gitname: newUser.gitname,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ✅ Đăng nhập (Login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Không tìm thấy người dùng" });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          gitname: user.gitname,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ✅ Đăng xuất (Logout)
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Đăng xuất thành công (token sẽ bị xóa ở phía client)",
  });
});

export default router;
