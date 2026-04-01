import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = () => {
    axios
      .post('http://localhost:3001/login', {
        username: username,
        password: password,
      })
      .then((response) => {
        // --- THIS IS WHERE STEP 4 HAPPENS ---
        // We now check if the backend sent the token
        if (response.data.auth || response.data.token) {
          const user = response.data.user;

          // Save the JWT Token (The new security passport)
          localStorage.setItem('token', response.data.token);

          // Save user details
          localStorage.setItem('userID', user.userID);
          localStorage.setItem('role', user.role);

          // Redirect based on role
          if (user.role === 'student') navigate('/student');
          else if (user.role === 'warden') navigate('/warden');
          else if (user.role === 'admin') navigate('/admin');
        } else {
          // If auth is false, but it didn't hit the catch block
          alert('Login Failed: ' + response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Invalid Username or Password');
      });
  };

  return (
    <div className="auth-card">
      {/* LEFT SIDE: The Inputs */}
      <div className="auth-left">
        <h2>Hello!</h2>
        <p>Sign in to your account</p>

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>SIGN IN</button>
        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Don't have an account? <a href="/register">Create</a>
        </p>
      </div>

      {/* RIGHT SIDE: The Welcome Message & Decoration */}
      <div className="auth-right">
        <h2 style={{ color: 'white', zIndex: 2 }}>Welcome Back!</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', zIndex: 2 }}>
          Access the Hostel Management System to manage your stay and complaints
          efficiently.
        </p>
      </div>
    </div>
  );
}

export default Login;
