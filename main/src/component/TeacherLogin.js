// TeacherLogin.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import teacherImage from '../img/teacher-removebg-preview.png';
import '../TeacherLogin.css';

function TeacherLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Fetch teacher accounts
            const teacherAccountResponse = await fetch('https://pcg81mqc-3003.asse.devtunnels.ms/teacheraccount');
            const teacherAccounts = await teacherAccountResponse.json();
    
            // Check if the username exists in the teacher accounts list
            const isValidUser = teacherAccounts.find(user => user.username === username && user.password === password);
            if (isValidUser) {
                alert('Login successful!');
                setUsername(username); // Set the username state
                navigate('/Bookedpage', { state: { username } }); // Pass the username as a prop to Bookpage
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred. Please try again.');
        }
    };
    
    return (
        <div className="container3">
            <div className="login-box3">
                <div className="left-side">
                    <div className="logo">
                        <img src={teacherImage} alt="Teacher Friendly Logo" />
                        <div className="logo-text">TEACHER</div>
                    </div>
                </div>
                <div className="right-side">
                    <div className="form-group3">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group3">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="login-method">
                        <Link to="/TeacherReg">Register?</Link>
                        <Link to="/LoginForm">Forgot Password?</Link>
                    </div>
                    <div className="form-group3">
                        <button id="loginButton" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherLogin;
