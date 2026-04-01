import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [role, setRole] = useState('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [course, setCourse] = useState('');

    const navigate = useNavigate();

    const register = () => {
        axios.post("http://localhost:3001/register", {
            username: username,
            password: password,
            name: name,
            role: role,
            rollNo: rollNo,
            course: course
        }).then((response) => {
            alert("Registration Successful!");
            navigate('/');
        }).catch((error) => {
            console.error(error);
            alert("Registration Failed. Check console.");
        });
    };

    return (
        <div className="auth-card">
            <div className="auth-left">
                <h2>Join Us!</h2>
                <p>Create your new account</p>
                <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                
                <select onChange={(e) => setRole(e.target.value)}>
                    <option value="student">Register as Student</option>
                    <option value="warden">Register as Warden</option>
                </select>

                {role === 'student' && (
                    <>
                        <input type="text" placeholder="Roll Number" onChange={(e) => setRollNo(e.target.value)} />
                        <input type="text" placeholder="Course" onChange={(e) => setCourse(e.target.value)} />
                    </>
                )}

                <button onClick={register}>REGISTER</button>
                <p>Already have an account? <a href="/">Login here</a></p>
            </div>
            <div className="auth-right">
                <h2>Hello Friend!</h2>
                <p>
                    Register now to gain access to the Hostel Management System.
                    Whether you are a student or a warden, manage your hostel life with ease.
                </p>
            </div>
        </div>
    );
}

export default Register;