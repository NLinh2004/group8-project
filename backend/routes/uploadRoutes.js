import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Cấu hình Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình Multer lưu tạm file
const storage = multer.memoryStorage(); // không lưu trên ổ cứng
const upload = multer({ storage });

// POST /api/upload-avatar
router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Chưa chọn file" });

    // Upload lên Cloudinary
    const result = await cloudinaryV2.uploader.upload_stream(
      { folder: "avatars" },
      (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        return res.json({ message: "Avatar uploaded successfully", avatar: result.secure_url });
      }
    );

    // Ghi buffer của file vào upload_stream
    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
