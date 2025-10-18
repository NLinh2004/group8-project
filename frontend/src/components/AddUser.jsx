import React, { useState, useEffect } from "react";

function AddUser({ onAddUser, onUpdateUser, editingUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gitname, setGitname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Điền form khi chỉnh sửa user
  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name || "");
      setEmail(editingUser.email || "");
      setGitname(editingUser.gitname || "");
    } else {
      setName("");
      setEmail("");
      setGitname("");
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !gitname.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Email không hợp lệ!");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingUser) {
        // Cập nhật user
        await onUpdateUser({ id: editingUser._id, name, email, gitname });
      } else {
        // Thêm user mới
        await onAddUser({ name, email, gitname });
      }
      setName("");
      setEmail("");
      setGitname("");
    } catch (error) {
      alert(`Lỗi khi ${editingUser ? "cập nhật" : "thêm"} người dùng. Vui lòng thử lại!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
      <h2>{editingUser ? "Sửa người dùng" : "Thêm người dùng"}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "5px" }}
            disabled={isSubmitting}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "5px" }}
            disabled={isSubmitting}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Git Name: </label>
          <input
            type="text"
            value={gitname}
            onChange={(e) => setGitname(e.target.value)}
            style={{ width: "100%", padding: "5px" }}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? "#cccccc" : "#1976d2",
            color: "#fff",
            padding: "8px 16px",
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