import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../LoginForm.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
      
        axios.put(`https://pcg81mqc-3004.asse.devtunnels.ms/studentaccount/${username}`, { password })
            .then(() => {
                alert('Password reset successful');
                navigate('/');
            })
            .catch(error => {
                alert('Failed to reset password: ' + error.message);
            });
    };

    return (
        <div className="container2">
            <div className="login-box2">
                <div className="form-group2">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group2">
                    <label htmlFor="password">New Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group2">
                    <label htmlFor="confirmPassword">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="form-group2">
                    <button id="loginButton" onClick={handleLogin}>Reset Password</button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
