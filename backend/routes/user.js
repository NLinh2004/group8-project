const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users
router.get('/', userController.getAllUsers);

// POST /users
router.post('/', userController.addUser);

module.exports = router;
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

module.exports = mongoose.model('User', UserSchema);