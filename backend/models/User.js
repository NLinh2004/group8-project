import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gitname: { type: String, required: true },
  password: { type: String, required: true },  // 🔥 THÊM DÒNG NÀY
  role: { type: String, enum: ["user", "admin"], default: "user" }  // 🔥 THÊM DÒNG NÀY
}, { timestamps: true });

export default mongoose.model("User", userSchema);