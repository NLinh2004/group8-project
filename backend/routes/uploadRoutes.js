import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";

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

// POST /api/upload/upload-avatar
router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Chưa chọn file" });

    // Upload lên Cloudinary sử dụng Promise
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinaryV2.uploader.upload_stream(
        { folder: "avatars" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({ message: "Avatar uploaded successfully", url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
