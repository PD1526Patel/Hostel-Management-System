import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function WardenDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('complaints');

    // --- DATA LISTS ---
    const [complaintsList, setComplaintsList] = useState([]);
    const [studentsNoRoom, setStudentsNoRoom] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [allStudents, setAllStudents] = useState([]); 
    const [visitorsList, setVisitorsList] = useState([]); // NEW

    // --- FORM STATES ---
    // Allocation
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    // Fees
    const [feeStudent, setFeeStudent] = useState('');
    const [feeAmount, setFeeAmount] = useState('');
    const [feeDesc, setFeeDesc] = useState('');
    const [feeDate, setFeeDate] = useState('');
    // Visitors (NEW)
    const [visName, setVisName] = useState('');
    const [visContact, setVisContact] = useState('');
    const [visStudent, setVisStudent] = useState('');

    // --- FETCH FUNCTIONS ---
    const fetchAllData = useCallback(() => {
        axios.get('http://localhost:3001/complaints').then(res => setComplaintsList(res.data || []));
        axios.get('http://localhost:3001/students-no-room').then(res => setStudentsNoRoom(res.data));
        axios.get('http://localhost:3001/available-rooms').then(res => setAvailableRooms(res.data));
        // Using students-no-room as a placeholder for "all students" dropdowns for simplicity
        axios.get('http://localhost:3001/students-no-room').then(res => setAllStudents(res.data)); 
        axios.get('http://localhost:3001/visitors').then(res => setVisitorsList(res.data)); // NEW
    }, []);

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'warden') navigate('/');
        else fetchAllData();
    }, [navigate, fetchAllData]);

    // --- HANDLERS ---
    const updateStatus = (id, newStatus) => {
        axios.put('http://localhost:3001/update-complaint', { complaintID: id, status: newStatus })
            .then(() => { alert("Updated"); fetchAllData(); });
    };

    const handleAllocation = () => {
        axios.post('http://localhost:3001/allocate-room', { studentID: selectedStudent, roomID: selectedRoom })
            .then(() => { alert("Allocated!"); fetchAllData(); setSelectedStudent(''); setSelectedRoom(''); });
    };

    const handleGenerateBill = () => {
        // Validation: Check if amount is positive
        if (!feeAmount || parseFloat(feeAmount) <= 0) {
            alert("Please enter a valid positive amount.");
            return;
        }
        
        if (!feeStudent || !feeDesc || !feeDate) {
            alert("Please fill all fields.");
            return;
        }

        axios.post('http://localhost:3001/generate-bill', { 
            studentID: feeStudent, 
            amount: feeAmount, 
            description: feeDesc, 
            dueDate: feeDate 
        }).then(() => { 
            alert("Bill Generated!"); 
            setFeeStudent(''); setFeeAmount(''); setFeeDesc(''); setFeeDate('');
        });
    };

    const handleVisitorEntry = () => {
        axios.post('http://localhost:3001/visitor-entry', { studentID: visStudent, name: visName, contact: visContact })
             .then(() => { alert("Entry Recorded"); fetchAllData(); setVisName(''); setVisContact(''); setVisStudent(''); });
    };

    const handleVisitorExit = (id) => {
        axios.put('http://localhost:3001/visitor-exit', { visitorID: id })
             .then(() => { alert("Exit Recorded"); fetchAllData(); });
    };

    const logout = () => { localStorage.clear(); navigate('/'); };

    return (
        <div className="dashboard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Warden Dashboard</h2>
                <button onClick={logout} style={{ background: '#e74c3c', width: 'auto' }}>Logout</button>
            </div>

            {/* TAB NAVIGATION */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap:'wrap' }}>
                <button onClick={() => setActiveTab('complaints')} style={{ background: activeTab==='complaints'?'#3498db':'#ccc'}}>Complaints</button>
                <button onClick={() => setActiveTab('allocation')} style={{ background: activeTab==='allocation'?'#3498db':'#ccc'}}>Allocation</button>
                <button onClick={() => setActiveTab('fees')} style={{ background: activeTab==='fees'?'#3498db':'#ccc'}}>Fees</button>
                <button onClick={() => setActiveTab('visitors')} style={{ background: activeTab==='visitors'?'#3498db':'#ccc'}}>Visitors</button>
            </div>

            {/* TAB 1: COMPLAINTS */}
            {activeTab === 'complaints' && (
                <table>
                    <thead><tr><th>Student</th><th>Title</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        {complaintsList.map((val, key) => (
                            <tr key={key}>
                                <td>{val.studentName}</td>
                                <td>{val.title}</td>
                                <td style={{color:val.status==='New'?'red':'green'}}>{val.status}</td>
                                <td>{val.status==='New' && <button onClick={()=>updateStatus(val.complaintID,'Resolved')} style={{background:'green', width:'auto', padding:'5px'}}>Resolve</button>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* TAB 2: ALLOCATION */}
            {activeTab === 'allocation' && (
                <div style={{padding:'20px', border:'1px solid #ddd'}}>
                    <h3>Allocate Room</h3>
                    <select value={selectedStudent} onChange={e=>setSelectedStudent(e.target.value)} style={{marginBottom:'10px'}}>
                        <option value="">Select Student</option>
                        {studentsNoRoom.map(s=><option key={s.studentID} value={s.studentID}>{s.name}</option>)}
                    </select>
                    <select value={selectedRoom} onChange={e=>setSelectedRoom(e.target.value)}>
                        <option value="">Select Room</option>
                        {availableRooms.map(r=><option key={r.roomID} value={r.roomID}>{r.roomNo}</option>)}
                    </select>
                    <button onClick={handleAllocation}>Allocate</button>
                </div>
            )}

            {/* TAB 3: FEES */}
            {activeTab === 'fees' && (
                <div style={{padding:'20px', border:'1px solid #ddd', borderRadius:'8px', background: '#f9f9f9'}}>
                    <h3 style={{marginTop:0}}>Generate Fee Bill</h3>
                    
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Select Student</label>
                    <select value={feeStudent} onChange={e=>setFeeStudent(e.target.value)}>
                        <option value="">-- Select Student --</option>
                        {allStudents.map(s => (
                            <option key={s.studentID} value={s.studentID}>{s.name}</option>
                        ))}
                    </select>

                    <label style={{fontWeight: 'bold', display: 'block', marginTop: '15px', marginBottom: '5px'}}>Amount (₹)</label>
                    <input 
                        type="number" 
                        placeholder="Enter Amount" 
                        value={feeAmount} 
                        onChange={e=>setFeeAmount(e.target.value)} 
                        min="1" // Prevents selecting negative numbers in UI
                    />

                    <label style={{fontWeight: 'bold', display: 'block', marginTop: '15px', marginBottom: '5px'}}>Description</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Mess Fee, Hostel Rent" 
                        value={feeDesc} 
                        onChange={e=>setFeeDesc(e.target.value)} 
                    />

                    <label style={{fontWeight: 'bold', display: 'block', marginTop: '15px', marginBottom: '5px'}}>Due Date</label>
                    <input 
                        type="date" 
                        value={feeDate} 
                        onChange={e=>setFeeDate(e.target.value)} 
                    />

                    <button onClick={handleGenerateBill} style={{marginTop: '20px'}}>Generate Bill</button>
                </div>
            )}

            {/* TAB 4: VISITORS (NEW) */}
            {activeTab === 'visitors' && (
                <div>
                    {/* Visitor Form */}
                    <div style={{padding:'20px', border:'1px solid #ddd', marginBottom:'20px', background:'#f9f9f9'}}>
                        <h3>Record New Visitor</h3>
                        <input type="text" placeholder="Visitor Name" value={visName} onChange={e=>setVisName(e.target.value)} />
                        <input type="text" placeholder="Contact Number" value={visContact} onChange={e=>setVisContact(e.target.value)} />
                        <select value={visStudent} onChange={e=>setVisStudent(e.target.value)}>
                            <option value="">Visiting Which Student?</option>
                            {allStudents.map(s=><option key={s.studentID} value={s.studentID}>{s.name}</option>)}
                        </select>
                        <button onClick={handleVisitorEntry}>Record Entry</button>
                    </div>

                    {/* Visitor Log Table */}
                    <h3>Visitor Log</h3>
                    <table>
                        <thead><tr><th>Name</th><th>Contact</th><th>Visiting</th><th>In Time</th><th>Out Time</th><th>Action</th></tr></thead>
                        <tbody>
                            {visitorsList.map((v, key) => (
                                <tr key={key}>
                                    <td>{v.name}</td>
                                    <td>{v.contact}</td>
                                    <td>{v.studentName}</td>
                                    <td>{new Date(v.inTime).toLocaleString()}</td>
                                    <td style={{fontWeight:'bold', color: v.outTime ? 'green' : 'red'}}>
                                        {v.outTime ? new Date(v.outTime).toLocaleString() : 'Active'}
                                    </td>
                                    <td>
                                        {!v.outTime && (
                                            <button onClick={()=>handleVisitorExit(v.visitorID)} style={{background:'#e67e22', width:'auto', padding:'5px 10px'}}>Mark Exit</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default WardenDashboard;