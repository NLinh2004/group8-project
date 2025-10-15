import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";
import axios from "axios"

function App() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAdded = () => {
    fetchUsers();
  };

  return (
    <div className="App">
      <h1>Quản lý người dùng</h1>
      <AddUser onUserAdded={handleUserAdded} />
      <UserList users={users} />
    </div>
  );
}

export default App;
