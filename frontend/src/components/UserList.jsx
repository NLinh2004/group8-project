import React from 'react';
import axios from 'axios';

function UserList({ users, setUsers, setEditUser }) {
  // Xử lý xóa user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa user:', err);
      alert('Có lỗi xảy ra khi xóa user!');
    }
  };

  // Xử lý chọn user để chỉnh sửa
  const handleEdit = (user) => {
    setEditUser(user);
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
      <h2>Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tên</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user._id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      border: 'none',
                      padding: '5px 10px',
                      marginRight: '5px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={{
                      backgroundColor: '#f44336',
                      color: '#fff',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
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