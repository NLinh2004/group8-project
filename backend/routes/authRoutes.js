import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js"; // ← THÊM

const router = express.Router();

// ==================== ĐĂNG KÝ ====================
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
    const newUser = new User({ name, email, gitname, password: hashedPassword, role: "user" });
    await newUser.save();

    // TẠO ACCESS TOKEN (15 PHÚT)
    const accessToken = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // TẠO REFRESH TOKEN (7 NGÀY)
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // LƯU REFRESH TOKEN VÀO DB
    await RefreshToken.create({
      token: refreshToken,
      userId: newUser._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      message: "Đăng ký thành công!",
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ==================== ĐĂNG NHẬP ====================
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

    // ACCESS TOKEN (15 PHÚT)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // REFRESH TOKEN (7 NGÀY)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // LƯU REFRESH TOKEN VÀO DB
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ==================== REFRESH TOKEN ====================
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Không có refresh token" });

  try {
    // KIỂM TRA DB
    const stored = await RefreshToken.findOne({
      token: refreshToken,
      revoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!stored) return res.status(401).json({ message: "Refresh token không hợp lệ hoặc đã hết hạn" });

    // XÁC THỰC TOKEN
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // TẠO TOKEN MỚI
    const user = await User.findById(payload.id);
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // HỦY CŨ, LƯU MỚI
    stored.revoked = true;
    await stored.save();

    await RefreshToken.create({
      token: newRefreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ message: "Refresh token không hợp lệ" });
  }
});

// ==================== ĐĂNG XUẤT ====================
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await RefreshToken.findOneAndUpdate(
      { token: refreshToken },
      { revoked: true }
    );
  }
  res.json({ message: "Đăng xuất thành công!" });
});

export default router;