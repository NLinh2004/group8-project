import React from "react";

function UserList({ users, onEditUser, onDeleteUser }) {
  const handleDelete = (id) => {
    // Log ID để debug
    console.log("Deleting user with ID:", id);
    // Xác nhận trước khi xóa
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      onDeleteUser(id);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
      <h2>Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ddd", textAlign: "center", padding: "8px", width: "10%" }}>STT</th>
              <th style={{ border: "1px solid #ddd", textAlign: "center", padding: "8px" }}>Tên</th>
              <th style={{ border: "1px solid #ddd", textAlign: "center", padding: "8px" }}>Email</th>
              <th style={{ border: "1px solid #ddd", textAlign: "center", padding: "8px" }}>Git Name</th>
              <th style={{ border: "1px solid #ddd", textAlign: "center", padding: "8px", width: "20%" }}>Hành động</th>
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
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                  <button
                    onClick={() => onEditUser(u)}
                    style={{
                      backgroundColor: "#2a842df6",
                      color: "#fff",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    style={{
                      backgroundColor: "#c73126ff",
                      color: "#fff",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;