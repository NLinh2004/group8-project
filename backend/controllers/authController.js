const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng ký
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ 
        **success: false,**
        message: "Email already exists" 
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    **// TẠO TOKEN TRONG SIGNUP**
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      **success: true,**
      message: "User created successfully",
      **data:** {
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      **success: false,**
      message: error.message 
    });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) 
      return res.status(400).json({ 
        **success: false,**
        message: "User not found" 
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ 
        **success: false,**
        message: "Invalid password" 
      });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      **success: true,**
      message: "Login success",
      **data:** {
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      **success: false,**
      message: error.message 
    });
  }
};

// Đăng xuất
exports.logout = (req, res) => {
  res.json({ 
    **success: true,**
    message: "Logout successful (token deleted on client side)" 
  });
};