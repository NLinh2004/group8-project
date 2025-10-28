import React, { useState, useEffect } from "react";
import "./../styles/Login.css";
import "./../styles/ProfileCard.css";
import gitIcon from "../assets/git-icon.png";
import mailIcon from "../assets/mail-icon.png";
import defaultAvatar from "../assets/default-avatar.jpg";

const ProfilePage = ({ user: initialUser, onLogout, onUpdate }) => {
  const [user, setUser] = useState(initialUser || {});
  const [name, setName] = useState("");
  const [gitname, setGitName] = useState("");
  const [avatar, setAvatar] = useState(initialUser?.avatar || defaultAvatar);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setGitName(user.gitname || "");
      setAvatar(user.avatar || defaultAvatar);
    }
  }, [user]);

  const handleInputChange = (field, value, setter) => {
    setter(value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setMessage("");
  };

  // NÉN ẢNH + GIỚI HẠN KÍCH THƯỚC
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Giới hạn 3MB
    if (file.size > 3 * 1024 * 1024) {
      setMessage("Ảnh quá lớn! Vui lòng chọn ảnh dưới 3MB.");
      return;
    }

    compressImage(file, (compressedBase64) => {
      setAvatar(compressedBase64);
      setMessage("Ảnh đã được nén và sẵn sàng cập nhật.");
    });
  };

  // HÀM NÉN ẢNH
  const compressImage = (file, callback) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const maxWidth = 800;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL("image/jpeg", 0.7);
      callback(compressed);
    };

    img.src = URL.createObjectURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Tên không được để trống";
    if (!gitname.trim()) newErrors.gitname = "Git name không được để trống";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setMessage("Đang lưu vào cơ sở dữ liệu...");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");

      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          gitname: gitname.trim(),
          avatar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Cập nhật thất bại");
      }

      const updatedUser = data.user;
      setUser(updatedUser);
      onUpdate && onUpdate(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Cập nhật thành công!");

    } catch (err) {
      setMessage(`Lỗi: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <p>Không có thông tin người dùng</p>;
  }

  const displayName = user.name?.trim() || "Chưa có tên";
  const displayGitName = user.gitname?.trim() || "Chưa có Git name";
  const email = user.email?.trim() || "Chưa có email";

  return (
    <div className="profile-container">
      {onLogout && (
        <button
          onClick={onLogout}
          className="auth-btn logout-btn"
          style={{ width: "150px", margin: "20px auto", display: "block" }}
        >
          Đăng xuất
        </button>
      )}

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* === FORM CẬP NHẬT (30%) === */}
        <div
          style={{
            flex: "0 0 30%",
            minWidth: "300px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
          }}
        >
          <h2 style={{ margin: "0 0 20px", color: "#1976d2", fontSize: "1.4rem", fontWeight: "600" }}>
            Cập nhật thông tin
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Tên */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", color: "#333" }}>
                Tên:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange("name", e.target.value, setName)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: `1px solid ${errors.name ? "#d32f2f" : "#ccc"}`,
                  fontSize: "15px",
                  fontFamily: "'Poppins', sans-serif",
                }}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p style={{ color: "#d32f2f", fontSize: "13px", margin: "6px 0 0" }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Git Name */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", color: "#333" }}>
                Git Name:
              </label>
              <input
                type="text"
                value={gitname}
                onChange={(e) => handleInputChange("gitname", e.target.value, setGitName)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: `1px solid ${errors.gitname ? "#d32f2f" : "#ccc"}`,
                  fontSize: "15px",
                  fontFamily: "'Poppins', sans-serif",
                }}
                disabled={isSubmitting}
              />
              {errors.gitname && (
                <p style={{ color: "#d32f2f", fontSize: "13px", margin: "6px 0 0" }}>
                  {errors.gitname}
                </p>
              )}
            </div>

            {/* Avatar */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", color: "#333" }}>
                Avatar:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isSubmitting}
                style={{ fontSize: "14px" }}
              />
              <p style={{ fontSize: "12px", color: "#666", margin: "6px 0 0" }}>
                Chọn ảnh mới (tối đa 3MB, sẽ tự động nén)
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? "#999" : "#1976d2",
                color: "#fff",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                width: "100%",
                marginTop: "10px",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {isSubmitting ? "Đang lưu..." : "Cập nhật"}
            </button>

            {/* THÔNG BÁO ĐẸP */}
            {message && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  textAlign: "center",
                  backgroundColor: message.includes("thành công") ? "#d4edda" : "#f8d7da",
                  color: message.includes("thành công") ? "#155724" : "#721c24",
                  border: `1px solid ${message.includes("thành công") ? "#c3e6cb" : "#f5c6cb"}`,
                }}
              >
                {message}
              </div>
            )}
          </form>
        </div>

        {/* === CARD PROFILE (70%) === */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <div className="profile-card">
            <div className="profile-left">
              <h1 className="user-name">{displayName}</h1>

              <div className="info-row">
                <img src={gitIcon} alt="Git icon" className="icon" />
                <span className="label">Tên git:</span>
                <span className="value">{displayGitName}</span>
              </div>

              <div className="info-row">
                <img src={mailIcon} alt="Mail icon" className="icon" />
                <span className="label">Email:</span>
                <span className="value">{email}</span>
              </div>
            </div>

            <div className="profile-right">
              <img src={avatar} alt="Avatar" className="avatar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;