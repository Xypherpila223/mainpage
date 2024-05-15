// StudentLogin.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import studentImage from '../img/studenttransparent.png';
import '../App.css';

function StudentLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Fetch student accounts
            const studentAccountResponse = await fetch('https://pcg81mqc-3001.asse.devtunnels.ms/studentaccount');
            const studentAccounts = await studentAccountResponse.json();
    
            // Check if the username exists in the student accounts list
            const isValidUser = studentAccounts.find(user => user.username === username && user.password === password);
            if (isValidUser) {
                alert('Login successful!');
                setUsername(username); // Set the username state
                navigate('/Bookpage', { state: { username } }); // Pass the username as a prop to Bookpage
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
                        <img src={studentImage} alt="Student Friendly Logo" />
                        <div className="logo-text">STUDENT</div>
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
                        <Link to="/registration">Register?</Link>
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

export default StudentLogin;
