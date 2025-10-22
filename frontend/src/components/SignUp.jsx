import React, { useState } from "react";
import API from "../api";
import background from "../assets/bg4.png";
import "../styles/Auth.css";

function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Mật khẩu không khớp");
      return;
    }
    try {
      const res = await API.signup(form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("❌ Lỗi khi đăng ký");
    }
  };

  return (
    <div
      className="auth-page"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="auth-container">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <h1>Đăng ký</h1>
          <form onSubmit={handleSubmit}>
            <label>Họ và tên</label>
            <input
              type="text"
              placeholder="Huỳnh Đặng Nhu Cương"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <label style={{ marginTop: "20px" }}>Email</label>
            <input
              type="email"
              placeholder="huynhdangnhucuong@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <label style={{ marginTop: "20px" }}>Tên git</label>
            <input
              type="text"
              placeholder="nhucuong"
              value={form.gitname}
               onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <div className="auth-password-group">
              <div>
                <label>Mật khẩu</label>
                <input
                  type="password"
                  placeholder="********"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Nhập lại mật khẩu</label>
                <input
                  type="password"
                  placeholder="********"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-button">
              Đăng ký
            </button>
          </form>

          {message && <p className="auth-message">{message}</p>}

          <p className="auth-link">
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="auth-right-inner"></div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
