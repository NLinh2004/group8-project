// ✅ Đặt dotenv ở đầu để đọc biến môi trường
require('dotenv').config();

// ✅ Import thư viện cần thiết
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Import kết nối MongoDB từ file riêng
const connectDB = require('./config/db');
connectDB(); // Gọi hàm kết nối

// ✅ Khởi tạo Express app
const app = express();
app.use(express.json()); // Cho phép đọc JSON từ client

// ✅ Tạo User schema
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String }
});
const User = mongoose.model('User', userSchema);

// ✅ API: Đăng ký (Sign Up)
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// ✅ API: Đăng nhập (Login)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Đăng nhập thành công', token });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// ✅ API: Đăng xuất (Logout)
app.post('/logout', (req, res) => {
  res.json({ message: 'Đăng xuất thành công. Hãy xóa token ở phía client.' });
});

// ✅ Import controller mẫu (nếu cần giữ lại)
const userController = require('./controllers/userController');

// ✅ Định nghĩa API mẫu
app.get('/users', userController.getUsers);
app.post('/users', userController.createUser);

// ✅ Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});