import React, { useState, useEffect } from "react";

function AddUser({ onAddUser, onUpdateUser, editingUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gitname, setGitname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", gitname: "" });

  // Điền form khi chỉnh sửa
  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name || "");
      setEmail(editingUser.email || "");
      setGitname(editingUser.gitname || "");
      setErrors({ name: "", email: "", gitname: "" });
    } else {
      setName("");
      setEmail("");
      setGitname("");
      setErrors({ name: "", email: "", gitname: "" });
    }
  }, [editingUser]);

  const validateForm = () => {
    const newErrors = { name: "", email: "", gitname: "" };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Tên không được để trống";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }
    if (!gitname.trim()) {
      newErrors.gitname = "Git Name không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingUser) {
        await onUpdateUser({ id: editingUser._id, name, email, gitname });
      } else {
        await onAddUser({ name, email, gitname });
      }
    } catch (error) {
      setErrors({
        ...errors,
        form: `Lỗi khi ${editingUser ? "cập nhật" : "thêm"} người dùng. Vui lòng thử lại!`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
      <h2>{editingUser ? "Sửa người dùng" : "Thêm người dùng"}</h2>
      {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "5px",
              borderColor: errors.name ? "red" : "#ddd",
            }}
            disabled={isSubmitting}
          />
          {errors.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "5px",
              borderColor: errors.email ? "red" : "#ddd",
            }}
            disabled={isSubmitting}
          />
          {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Git Name: </label>
          <input
            type="text"
            value={gitname}
            onChange={(e) => setGitname(e.target.value)}
            style={{
              width: "100%",
              padding: "5px",
              borderColor: errors.gitname ? "red" : "#ddd",
            }}
            disabled={isSubmitting}
          />
          {errors.gitname && <p style={{ color: "red", fontSize: "12px" }}>{errors.gitname}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? "#cccccc" : "#1976d2",
            color: "#fff",
            padding: "8px 22px",
            border: "none",
            borderRadius: "5px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Đang xử lý..." : editingUser ? "Cập nhật" : "Thêm"}
        </button>
      </form>
    </div>
  );
}

export default AddUser;