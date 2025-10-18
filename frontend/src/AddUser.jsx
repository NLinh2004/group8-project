import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddUser({ fetchUsers, editUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (editUser) {
      setName(editUser.name);
      setEmail(editUser.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [editUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Email không hợp lệ!');
      return;
    }

    try {
      console.log('Sending request with body:', { name, email });
      if (editUser) {
        await axios.put(`http://localhost:5000/api/users/${editUser._id}`, { name, email });
      } else {
        await axios.post('http://localhost:5000/api/users', { name, email });
      }
      console.log('User added/updated, fetching users...');
      await fetchUsers();
      setName('');
      setEmail('');
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu:', err.message);
      console.error('Chi tiết lỗi:', err.response ? err.response.data : err);
      alert('Có lỗi xảy ra khi thêm/cập nhật user!');
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
      <h2>{editUser ? 'Sửa người dùng' : 'Thêm người dùng'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#1976d2',
            color: '#fff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {editUser ? 'Cập nhật' : 'Thêm'}
        </button>
      </form>
    </div>
  );
}

export default AddUser;