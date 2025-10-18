import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js"; // import model User

dotenv.config({ path: "./.env" }); // nạp biến môi trường

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware để đọc JSON trong body
app.use(express.json());

// ✅ Kết nối MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Kiểm tra server chạy
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
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✏️ Cập nhật user (PUT)
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, gitname, github } = req.body; // thêm 2 thuộc tính mới
    const newUser = new User({ name, email, gitname, github });
    await newUser.save();
    res.status(201).json(newUser);
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

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
