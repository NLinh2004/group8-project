import React, { useEffect, useState } from "react";
import "./../styles/ProfileCard.css";
import gitIcon from "../assets/git-icon.png";
import mailIcon from "../assets/mail-icon.png";
import defaultAvatar from "../assets/default-avatar.jpg";

function ProfileCard() {
  const [user, setUser] = useState({});

  useEffect(() => {
    // ✅ Lấy thông tin từ localStorage (được lưu khi login thành công)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="profile-card">
      <div className="profile-left">
        <h1 className="user-name">{user.name || "TÊN NGƯỜI DÙNG"}</h1>

        <div className="info-row">
          <img src={gitIcon} alt="Git icon" className="icon" />
          <span className="label">Tên git:</span>
          <span className="value">{user.gitName || "Chưa có"}</span>
        </div>

        <div className="info-row">
          <img src={mailIcon} alt="Mail icon" className="icon" />
          <span className="label">Email:</span>
          <span className="value">{user.email || "Chưa có"}</span>
        </div>
      </div>

      <div className="profile-right">
        <img
          src={user.avatar || defaultAvatar}
          alt="Avatar"
          className="avatar"
        />
      </div>
    </div>
  );
}

export default ProfileCard;
