import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware đọc JSON
app.use(express.json());

// ✅ Kết nối MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Lỗi MongoDB:", err));

// ✅ Kiểm tra server
app.get("/", (req, res) => {
  res.send("✅ Server đang chạy đúng");
});

// 🟢 Lấy toàn bộ users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟢 Thêm user mới
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, gitname } = req.body;
    const newUser = new User({ name, email, gitname });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✏️ Cập nhật user (PUT)
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ❌ Xóa user (DELETE)
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json({ message: "Xóa user thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ❌ Xóa toàn bộ users (test)
app.delete("/api/users", async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: "Đã xóa toàn bộ người dùng" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
