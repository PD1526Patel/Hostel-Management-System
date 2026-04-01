import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [myComplaints, setMyComplaints] = useState([]);
  const [myBills, setMyBills] = useState([]);

  const navigate = useNavigate();

  // Retrieve both ID and the new Token
  const studentID = localStorage.getItem('userID');
  const token = localStorage.getItem('token');

  // 1. Fetch Complaints with Token
  const fetchComplaints = useCallback(() => {
    axios
      .get('http://localhost:3001/complaints', {
        params: { studentID: studentID },
        headers: { 'x-access-token': token }, // SECURE HEADER
      })
      .then((res) => setMyComplaints(res.data))
      .catch((err) => console.error('Session expired or unauthorized', err));
  }, [studentID, token]);

  // 2. Fetch Bills with Token
  const fetchBills = useCallback(() => {
    axios
      .get('http://localhost:3001/student-bills', {
        params: { studentID: studentID },
        headers: { 'x-access-token': token }, // SECURE HEADER
      })
      .then((res) => setMyBills(res.data))
      .catch((err) => console.error(err));
  }, [studentID, token]);

  useEffect(() => {
    // Kick out if ID OR Token is missing
    if (!studentID || !token) {
      navigate('/');
    } else {
      fetchComplaints();
      fetchBills();
    }
  }, [navigate, studentID, token, fetchComplaints, fetchBills]);

  // 3. Post Complaint with Token
  const lodgeComplaint = () => {
    axios
      .post(
        'http://localhost:3001/lodge-complaint',
        { studentID, title, description },
        { headers: { 'x-access-token': token } }, // SECURE HEADER
      )
      .then(() => {
        alert('Complaint Lodged!');
        setTitle('');
        setDescription('');
        fetchComplaints();
      })
      .catch(
        (err) => console.log('Payment Error:', err),
        alert('Failed to lodge complaint. Your session might have expired.'),
      );
  };

  // 4. Pay Bill with Token
  const payBill = (id) => {
    if (window.confirm('Simulate Payment for this bill?')) {
      axios
        .post(
          'http://localhost:3001/pay-bill',
          { feeID: id },
          { headers: { 'x-access-token': token } }, // SECURE HEADER
        )
        .then(() => {
          alert('Payment Successful!');
          fetchBills();
        });
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Student Dashboard</h2>
        <button
          onClick={logout}
          style={{ background: '#e74c3c', width: 'auto' }}
        >
          Logout
        </button>
      </div>

      {/* --- SECTION 1: MY FEES --- */}
      <div
        style={{
          marginBottom: '40px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          background: '#f9f9f9',
        }}
      >
        <h3 style={{ marginTop: 0 }}>My Fees & Dues</h3>
        {myBills.length === 0 ? (
          <p>No pending bills.</p>
        ) : (
          <table style={{ marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myBills.map((bill) => (
                <tr key={bill.feeID}>
                  <td>{bill.description}</td>
                  <td>₹{bill.amount}</td>
                  <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                  <td
                    style={{
                      color: bill.status === 'Paid' ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {bill.status}
                  </td>
                  <td>
                    {bill.status === 'Pending' && (
                      <button
                        onClick={() => payBill(bill.feeID)}
                        style={{
                          background: 'green',
                          padding: '8px 15px',
                          fontSize: '14px',
                          width: 'auto',
                          color: 'white',
                        }}
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- SECTION 2: LODGE COMPLAINT --- */}
      <div
        style={{
          marginBottom: '40px',
          border: '1px solid #ddd',
          padding: '20px',
          borderRadius: '8px',
          background: '#f9f9f9',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Lodge a New Complaint</h3>

        <label
          style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}
        >
          Title
        </label>
        <input
          type="text"
          placeholder="e.g. Broken Fan"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label
          style={{
            fontWeight: 'bold',
            display: 'block',
            marginTop: '15px',
            marginBottom: '5px',
          }}
        >
          Description
        </label>
        <textarea
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={lodgeComplaint} style={{ marginTop: '10px' }}>
          Submit Complaint
        </button>
      </div>

      {/* --- SECTION 3: COMPLAINT HISTORY --- */}
      <h3>Complaint History</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {myComplaints.map((val) => (
            <tr key={val.complaintID}>
              <td>{val.complaintID}</td>
              <td>{val.title}</td>
              <td>
                {val.dateFiled
                  ? new Date(val.dateFiled).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td
                style={{
                  color: val.status === 'Resolved' ? 'green' : 'orange',
                  fontWeight: 'bold',
                }}
              >
                {val.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDashboard;
