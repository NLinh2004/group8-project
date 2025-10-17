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

// Kết nối MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// 🟢 Route: Lấy toàn bộ users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟢 Route: Thêm user mới
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

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("✅ Server đang chạy đúng");
});
