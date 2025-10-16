const express = require('express');
const app = express();
const port = 3000;

// Cho phép đọc JSON trong request
app.use(express.json());

// Import route user
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

// Chạy server
app.listen(port, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${port}`);
});
