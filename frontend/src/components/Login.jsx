// components/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import background from "../assets/bg4.png";

function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Tự động điền nếu có remember me
  useEffect(() => {
    const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || {};
    const lastEmail = localStorage.getItem("lastEmail");
    if (lastEmail && savedPasswords[lastEmail]) {
      setForm({ email: lastEmail, password: savedPasswords[lastEmail] });
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1. Đăng nhập
      const loginRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.message || "Đăng nhập thất bại");

      // 2. Lưu remember me
      if (remember) {
        const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || {};
        savedPasswords[form.email.trim()] = form.password;
        localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
        localStorage.setItem("lastEmail", form.email.trim());
      } else {
        localStorage.removeItem("lastEmail");
      }

      // 3. LẤY THÔNG TIN PROFILE CHI TIẾT
      const profileRes = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${loginData.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!profileRes.ok) {
        const err = await profileRes.json();
        throw new Error(err.message || "Không thể lấy thông tin profile");
      }

      const profileData = await profileRes.json();

      // 4. GỌI CALLBACK VỚI USER ĐẦY ĐỦ
      onLoginSuccess(profileData, loginData.token);

      setMessage(`Chào mừng ${profileData.name || "bạn"}!`);

      // 5. Chuyển hướng
      setTimeout(() => navigate("/profile"), 600);

    } catch (err) {
      setMessage(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ backgroundImage: `url(${background})` }}>
      <div className="auth-container">
        <div className="auth-left">
          <h1 className="auth-title">Đăng nhập</h1>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="auth-input"
              disabled={loading}
            />

            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="********"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="auth-input"
              disabled={loading}
            />

            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                Ghi nhớ đăng nhập
              </label>
              <a href="/forgot-password" 
                  onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgot-password");
                  }}
                style={{ cursor: "pointer", color: "#1976d2", textDecoration: "underline" }}
              >
                Quên mật khẩu?
              </a>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <p className="auth-bottom-text">
              Chưa có tài khoản? <a href="/signup">Đăng ký ngay</a>
            </p>

            {message && <p className="auth-message">{message}</p>}
          </form>
        </div>
        <div className="auth-right"></div>
      </div>
    </div>
  );
}

export default Login;