import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    wardens: 0,
    complaints: 0,
    rooms: 0,
  });
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Fetch Stats with Security Header
  const fetchStats = useCallback(() => {
    axios
      .get('http://localhost:3001/admin/stats', {
        headers: { 'x-access-token': token },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Stats fetch failed', err));
  }, [token]);

  // Fetch Users with Security Header
  const fetchUsers = useCallback(() => {
    axios
      .get('http://localhost:3001/admin/users', {
        headers: { 'x-access-token': token },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Users fetch failed', err));
  }, [token]);

  useEffect(() => {
    // Security Check: Only allow 'admin' role
    if (role !== 'admin' || !token) {
      navigate('/');
    } else {
      fetchStats();
      fetchUsers();
    }
  }, [navigate, role, token, fetchStats, fetchUsers]);

  const deleteUser = (id) => {
    if (
      window.confirm('Are you sure? This will delete the user permanently.')
    ) {
      axios
        .delete(`http://localhost:3001/admin/delete-user/${id}`, {
          headers: { 'x-access-token': token },
        })
        .then(() => {
          alert('User Deleted');
          fetchUsers();
          fetchStats();
        })
        .catch((err) => console.error(err));
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const cardStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    flex: 1,
    textAlign: 'center',
    minWidth: '150px',
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '30px',
        }}
      >
        <h2>Administrator Dashboard</h2>
        <button
          onClick={logout}
          style={{ background: '#e74c3c', width: 'auto' }}
        >
          Logout
        </button>
      </div>

      {/* ANALYTICS SECTION */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '40px',
        }}
      >
        <div style={cardStyle}>
          <h3 style={{ color: '#3498db' }}>{stats.students}</h3>
          <p>Students</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#9b59b6' }}>{stats.wardens}</h3>
          <p>Wardens</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#e67e22' }}>{stats.complaints}</h3>
          <p>New Complaints</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#2ecc71' }}>{stats.rooms}</h3>
          <p>Free Rooms</p>
        </div>
      </div>

      <h3>User Management</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userID}>
              <td>{user.userID}</td>
              <td>{user.name}</td>
              <td>
                <span className={`badge ${user.role}`}>{user.role}</span>
              </td>
              <td>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => deleteUser(user.userID)}
                    style={{
                      background: '#c0392b',
                      padding: '5px 10px',
                      width: 'auto',
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
