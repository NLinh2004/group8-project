import React, { useState } from "react";
import ProfileCard from "../components/ProfileCard";
import ProfileUpdateForm from "../components/ProfileUpdateForm";

const TestProfile = () => {
  const [user, setUser] = useState({
    name: "Huỳnh Đặng Nhu Cương",
    gitname: "cuonghdn",
    email: "cuong@example.com",
  });

  const handleUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "25px",
      }}
    >
      {/* Thẻ thông tin */}
      <ProfileCard user={user} />

      {/* Form cập nhật nằm ngay bên dưới */}
      <ProfileUpdateForm user={user} onUpdate={handleUpdate} />
    </div>
  );
};

export default TestProfile;
