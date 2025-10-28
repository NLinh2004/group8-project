import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import background from "../assets/bg4.png";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [remember, setRemember] = useState(false); // ✅ Trạng thái tick "ghi nhớ"

  // ✅ Khi người dùng nhập email, nếu email đã được lưu mật khẩu → tự động điền
  useEffect(() => {
    const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || {};
    if (form.email && savedPasswords[form.email]) {
      setForm((prev) => ({ ...prev, password: savedPasswords[form.email] }));
    }
  }, [form.email]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST", // ✅ phải dùng POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Không thể đăng nhập");
    }

    // ✅ Nếu tick "Ghi nhớ đăng nhập"
    if (remember) {
      const savedPasswords =
        JSON.parse(localStorage.getItem("savedPasswords")) || {};
      savedPasswords[form.email] = form.password;
      localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
    }

    // ✅ Lưu token & user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setMessage(`✅ Đăng nhập thành công - Chào mừng ${data.user.name}!`);
  } catch (err) {
    setMessage(`❌ ${err.message}`);
  }
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMessage("✅ Đăng xuất thành công");
    setForm({ email: "", password: "" });
  };

  // ✅ Khi người dùng đổi mật khẩu → cập nhật lại mật khẩu trong localStorage
  const handlePasswordChange = (newPassword) => {
    setForm((prev) => ({ ...prev, password: newPassword }));

    const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || {};
    if (form.email && savedPasswords[form.email]) {
      savedPasswords[form.email] = newPassword;
      localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
    }
  };

  return (
    <div className="auth-page" style={{ backgroundImage: `url(${background})` }}>
      <div className="auth-container">
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
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              className="auth-input"
            />

            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{" "}
                Ghi nhớ đăng nhập
              </label>
              <a href="#">Quên mật khẩu?</a>
            </div>

            <button type="submit" className="auth-btn">
              Đăng nhập
            </button>

            <p className="auth-bottom-text">
              Chưa có tài khoản? <a href="/signup">Đăng ký ngay</a>
            </p>

            {message && <p className="auth-message">{message}</p>}
          </form>

          {/* Nút đăng xuất */}
          {localStorage.getItem("token") && (
            <button
              onClick={handleLogout}
              className="auth-btn"
              style={{ marginTop: "10px" }}
            >
              Đăng xuất
            </button>
          )}
        </div>

        {/* RIGHT SIDE - Gradient */}
        <div className="auth-right"></div>
      </div>
    </div>
  );
}

export default Login;