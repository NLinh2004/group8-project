import React, { useState, useEffect } from "react";

function AddUser({ onAddUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onAddUser({ name, email });
    setName("");
    setEmail("");
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
      <h2>Thêm người dùng</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Thêm
        </button>
      </form>
    </div>
  );
}

export default AddUser;
