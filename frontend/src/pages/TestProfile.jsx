import React, { useState, useEffect } from "react";
import ProfileCard from "../components/ProfileCard";
import ProfileUpdateForm from "../components/ProfileUpdateForm";

const TestProfile = () => {
  const [user, setUser] = useState({
    name: "Huỳnh Đặng Nhu Cương",
    gitname: "cuonghdn",
    email: "cuong220851@student.nctu.edu.vn",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Lưu lại
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "40px",
        padding: "60px 40px", // ✅ thêm khoảng cách đều trên dưới
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
      }}
    >
      {/* ✅ Bên trái: Form cập nhật */}
      <div
        style={{
          flex: "1",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "stretch",
          height: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <ProfileUpdateForm user={user} onUpdate={handleUpdate} />
        </div>
      </div>

      {/* ✅ Bên phải: Thông tin Profile */}
      <div
        style={{
          flex: "1",
          maxWidth: "900px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "stretch",
          height: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            height: "100%",
          }}
        >
          <ProfileCard user={user} />
        </div>
      </div>
    </div>
  );
};

export default TestProfile;
