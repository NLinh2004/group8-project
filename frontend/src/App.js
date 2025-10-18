import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUser from './components/AddUser';
import UserList from './components/UserList';
import background from './assets/blue_3.png';

function App() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    try {
      console.log('Sending GET request to http://localhost:5000/api/users');
      const res = await axios.get('http://localhost:5000/api/users');
      console.log('Dữ liệu từ API:', res.data);
      if (!Array.isArray(res.data)) {
        console.error('Response is not an array:', res.data);
        return;
      }
      setUsers(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách:', err.message);
      console.error('Chi tiết lỗi:', err.response ? err.response.data : err);
    }
  };

  useEffect(() => {
    console.log('Fetching users on mount');
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '99% 95%',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#1976d2' }}>
        Quản lý người dùng
      </h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <div style={{ width: '45%' }}>
          <AddUser fetchUsers={fetchUsers} editUser={editUser} />
        </div>
        <div style={{ width: '50%' }}>
          <UserList users={users} setUsers={setUsers} setEditUser={setEditUser} />
        </div>
      </div>
    </div>
  );
}

export default App;