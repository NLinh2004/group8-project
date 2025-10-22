import React, { useState } from "react";
import API from "../api";
import "../styles/Login.css"; // CSS dùng chung phong cách với SignUp
import background from "../assets/bg4.png";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.login(form);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      setToken("❌ " + (err.response?.data?.message || "Không thể đăng nhập"));
    }
  };

  return (
    <div className="auth-page"
              style={{ backgroundImage: `url(${background})` }}
    >
      <div className="auth-container" >
        {/* LEFT SIDE - Form */}
        <div className="auth-left">
          <h1 className="auth-title">Đăng nhập</h1>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="auth-input"
            />

            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="********"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="auth-input"
            />

            <div className="login-options">
              <label>
                <input type="checkbox" /> Ghi nhớ đăng nhập
              </label>
              <a href="#">Quên mật khẩu?</a>
            </div>

            <button type="submit" className="auth-btn">
              Đăng nhập
            </button>

            <p className="auth-bottom-text">
              Chưa có tài khoản? <a href="#">Đăng ký ngay</a>
            </p>

            {token && <p className="auth-message">{token}</p>}
          </form>
        </div>

        {/* RIGHT SIDE - Gradient */}
        <div className="auth-right"></div>
      </div>
    </div>
  );
}

export default Login;
