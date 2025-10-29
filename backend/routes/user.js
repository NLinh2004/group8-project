import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  uploadAvatar
} from "../controllers/userController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// CRUD
router.get("/", getUsers);
router.post("/", createUser); // ✅ POST /api/users
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Nâng cao
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

export default router;
