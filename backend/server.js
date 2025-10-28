import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Lỗi MongoDB:", err));

// ✅ Test route
app.get("/", (req, res) => res.send("✅ Server đang chạy đúng"));


// ✅ Routes
app.use("/api/auth", authRoutes);        // Auth
app.use("/api/profile", profileRoutes);  // Profile

// CRUD User
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/*
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
*/
//Thêm phần password
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, gitname, password } = req.body; // ✅ thêm password
    const newUser = new User({ name, email, gitname, password }); // ✅ thêm password
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "✅ Đăng ký thành công",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Auth routes
app.use("/api/auth", authRoutes);


// ✅ Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
