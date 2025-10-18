const express = require('express');
const router = express.Router();
const User = require('../models/User'); // chỉ import thôi, không tạo lại

// Ví dụ route:
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
