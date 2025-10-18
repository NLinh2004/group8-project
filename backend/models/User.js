import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gitname: { type: String },
    github: { type: String }, // hoặc thuộc tính bạn muốn thêm, ví dụ 'role', 'password' v.v.
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
