let users = [
  { id: 1, name: "Linh", email: "tangthinhutlinh241104@gmail.com" },
  { id: 2, name: "Cương", email: "cuong220851@student.nctu.edu.vn" },
  { id: 3, name: "An", email: "caolamphanan@gmail.com" }
];

exports.getAllUsers = (req, res) => {
  res.json(users);
};

exports.addUser = (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
};
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  const newUser = new User({ name, email });
  await newUser.save();
  res.json(newUser);
};