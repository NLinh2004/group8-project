import React from "react";

function UserList({ users }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
      <h2>Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tên</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{u.id}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{u.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;
