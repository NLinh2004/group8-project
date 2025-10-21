import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Đăng ký tài khoản
router.post("/signup", async (req, res) => {
  try {
    const { name, email, gitname, password } = req.body;

    if (!name || !email || !gitname || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      gitname,
      password: hashedPassword,
    });

    await newUser.save();

    // 🔥 THÊM 3 DÒNG TOKEN CHO SIGNUP
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,  // 🔥 SỬA DÒNG 1: JWT_SECRET
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Đăng ký thành công!",
      token,  // 🔥 THÊM DÒNG 2: TOKEN
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ email và mật khẩu" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // 🔥 SỬA DÒNG 3: JWT_SECRET
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,  // 🔥 SỬA TỪ "SECRET_KEY"
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Đăng xuất thành công!" });
});

export default router;