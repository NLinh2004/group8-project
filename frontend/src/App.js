import React, { useEffect, useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import background from "./assets/blue_3.png";

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // Lấy danh sách users
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  // Thêm user mới
  const onAddUser = async (newUser) => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      fetchUsers();
      setEditingUser(null); // Reset form
    } catch (error) {
      console.error("❌ Lỗi khi thêm user:", error);
      throw error;
    }
  };

  // Cập nhật user
  const onUpdateUser = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      fetchUsers();
      setEditingUser(null); // Reset form
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật user:", error);
      throw error;
    }
  };

  // Xóa user
  const onDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      fetchUsers();
    } catch (error) {
      console.error("❌ Lỗi khi xóa user:", error);
      alert("Lỗi khi xóa user. Vui lòng thử lại!");
    }
  };

  // Chọn user để chỉnh sửa
  const onEditUser = (user) => {
    setEditingUser(user);
  };

  // Gọi fetchUsers khi mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial",
        backgroundRepeat: "no-repeat",
        backgroundSize: "99% 95%",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#1976d2" }}>Quản lý người dùng</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <div style={{ width: "35%" }}>
          <AddUser onAddUser={onAddUser} onUpdateUser={onUpdateUser} editingUser={editingUser} />
        </div>
        <div style={{ width: "60%" }}>
          <UserList users={users} onEditUser={onEditUser} onDeleteUser={onDeleteUser} />
        </div>
      </div>
    </div>
  );
}

export default App;