// src/api.js
import axios from "axios";

// ✅ Kiểm tra biến môi trường (nếu anh bật mock toàn cục)
const globalMock = process.env.REACT_APP_USE_MOCK === "true";

// ✅ 1. Tạo axios client cho backend thật
const realAPI = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ 2. Mock API riêng cho test giao diện
const mockAPI = {
  signup: async (data) => {
    console.log("📦 Mock signup:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả độ trễ mạng
    return { data: { message: "✅ Đăng ký thành công (mock)" } };
  },

  login: async (data) => {
    console.log("📦 Mock login:", data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (data.email === "test@example.com" && data.password === "123456") {
      return { data: { token: "mocked_token_123456789" } };
    } else {
      throw { response: { data: { message: "Sai email hoặc mật khẩu (mock)" } } };
    }
  },
};

// ✅ 3. Kết hợp mock + API thật
const API = {
  // 👉 Chỉ mock hai cái này
  signup: globalMock ? mockAPI.signup : mockAPI.signup,
  login: globalMock ? mockAPI.login : mockAPI.login,

  // 👉 Các API khác vẫn dùng backend thật
  getUsers: () => realAPI.get("/users"),
  addUser: (data) => realAPI.post("/users", data),
  updateUser: (id, data) => realAPI.put(`/users/${id}`, data),
  deleteUser: (id) => realAPI.delete(`/users/${id}`),
};

// ✅ 4. Export mặc định (để import API from "../api" không lỗi nữa)
export default API;
