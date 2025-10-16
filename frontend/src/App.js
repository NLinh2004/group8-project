import React, { useState, useEffect } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
//import "./App.css";
import background from "./assets/blue_3.png";
function App() {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "a@example.com" },
    { id: 2, name: "Trần Thị B", email: "b@example.com" },
  ]);

  // Hàm thêm user mới
  const handleAddUser = (newUser) => {
    const id = users.length ? users[users.length - 1].id + 1 : 1;
    setUsers([...users, { id, ...newUser }]);
  };

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
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <div style={{ width: "45%" }}>
          <AddUser onAddUser={handleAddUser} />
        </div>
        <div style={{ width: "50%" }}>
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
}

export default App;
