import React, { useState, useEffect } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import axios from "axios";
import background from "./assets/blue_3.png";

function App() {
  const [users, setUsers] = useState([]);

  // Hàm lấy dữ liệu từ backend (MongoDB)
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", err);
    }
  };

  // Gọi khi thêm user mới
  const handleAddUser = async (newUser) => {
    try {
      await axios.post("http://localhost:5000/api/users", newUser);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi thêm người dùng:", err);
      alert("Không thể thêm người dùng. Kiểm tra lại backend!");
    }
  };

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
      <h1 style={{ textAlign: "center", color: "#1976d2" }}>
        Quản lý người dùng
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Form thêm user - hẹp lại */}
        <div style={{ width: "35%", minWidth: "300px" }}>
          <AddUser onAddUser={handleAddUser} />
        </div>

        {/* Bảng danh sách user - rộng hơn */}
        <div style={{ width: "60%" }}>
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
}

export default App;