import React from "react";

function UserList({ users }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
      <h2>Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px", width: "10%" }}>STT</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tên</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Git Name</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u._id}>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                  {index + 1}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{u.name || "N/A"}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{u.email || "N/A"}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{u.gitname || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;