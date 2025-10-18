import React, { useEffect, useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import background from "./assets/blue_3.png";

function App() {
  const [users, setUsers] = useState([]);

  // Hàm lấy dữ liệu từ backend (MongoDB)
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  // Hàm thêm user mới
  const onAddUser = async (newUser) => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchUsers(); // Refresh danh sách sau khi thêm
    } catch (error) {
      console.error("❌ Lỗi khi thêm user:", error);
      alert("Không thể thêm user. Vui lòng kiểm tra server!");
    }
  };

  // Gọi fetchUsers khi component mount
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
        {/* Form thêm user */}
        <div style={{ width: "35%" }}>
          <AddUser onAddUser={onAddUser} /> {/* Sửa prop */}
        </div>

        {/* Bảng hiển thị user */}
        <div style={{ width: "60%" }}>
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
}

export default App;