import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../registration.css';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        schoolId: '',
        email: '',
        lastname: '',
        course: '',
        firstname: '',
        section: '',
        middleInitial: '',
        year: '',
        age: '',
        contact: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [usernameExists, setUsernameExists] = useState(false);
    const [schoolIdExists, setSchoolIdExists] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
        setUsernameExists(false); // Reset usernameExists when input changes
        setSchoolIdExists(false); // Reset schoolIdExists when input changes
    };
    

    const checkUsernameExists = async (username) => {
        const response = await fetch(`https://pcg81mqc-3001.asse.devtunnels.ms/studentaccount/exists?username=${username}`);
        const data = await response.json();
        return data.usernames.includes(username);
    };

    const checkSchoolIdExists = async (schoolId) => {
        const response = await fetch(`https://pcg81mqc-3002.asse.devtunnels.ms/studentprofile/exists?schoolIds=${schoolId}`);
        const data = await response.json();
        return data.schoolIds.includes(schoolId);
    };

    const checkUsername = useCallback(async () => {
        try {
            setUsernameExists(await checkUsernameExists(formData.username));
        } catch (error) {
            console.error('Error checking username:', error);
            setUsernameExists(false);
        }
    }, [formData.username]);

    const checkSchoolId = useCallback(async () => {
        try {
            setSchoolIdExists(await checkSchoolIdExists(formData.schoolId));
        } catch (error) {
            console.error('Error checking school ID:', error);
            setSchoolIdExists(false);
        }
    }, [formData.schoolId]);

    useEffect(() => {
        if (formData.username) {
            checkUsername();
        } else {
            setUsernameExists(false); // Reset usernameExists if username is empty
        }

        if (formData.schoolId) {
            checkSchoolId();
        } else {
            setSchoolIdExists(false); // Reset schoolIdExists if schoolId is empty
        }
    }, [formData.username, formData.schoolId, checkUsername, checkSchoolId]);

    const resetForm = () => {
        setFormData({
            schoolId: '',
            email: '',
            lastname: '',
            course: '',
            firstname: '',
            section: '',
            middleInitial: '',
            year: '',
            age: '',
            contact: '',
            username: '',
            password: '',
            confirmPassword: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        setErrorMessage(''); // Reset error message
    
        let usernameExists = false;
        let schoolIdExists = false;
    
        // Check if the username exists
        try {
            const usernameResponse = await fetch(`https://pcg81mqc-3001.asse.devtunnels.ms/studentaccount/exists?username=${formData.username}`);
            const usernameData = await usernameResponse.json();
            usernameExists = usernameData.usernames.includes(formData.username);
        } catch (error) {
            console.error('Error checking username:', error);
            setErrorMessage('Error checking username');
            return;
        }
    
        // Check if the school ID exists
        try {
            const schoolIdResponse = await fetch(`https://pcg81mqc-3002.asse.devtunnels.ms/studentprofile/exists?schoolIds=${formData.schoolId}`);
            const schoolIdData = await schoolIdResponse.json();
            schoolIdExists = schoolIdData.schoolIds.includes(formData.schoolId);
        } catch (error) {
            console.error('Error checking school ID:', error);
            setErrorMessage('Error checking school ID');
            return;
        }
    
        // Show different alerts based on the existence of username and school ID
        if (usernameExists && schoolIdExists) {
            alert('Username and School ID already exist');
            return;
        } else if (usernameExists) {
            alert('Username already exists');
            return;
        } else if (schoolIdExists) {
            alert('School ID already exists');
            return;
        }
    
        let errorMessage = ''; // Local variable for error message
    
        // Check if any of the fields are blank
        for (const key in formData) {
            if (formData[key].trim() === '') {
                errorMessage = 'Please fill in all fields';
                break;
            }
        }
    
        if (formData.password !== formData.confirmPassword) {
            errorMessage = 'Passwords do not match';
        }
    
        if (errorMessage) {
            setErrorMessage(errorMessage);
            return;
        }
    
        try {
            // Post studentprofile data
            await axios.post('https://pcg81mqc-3002.asse.devtunnels.ms/studentprofile', formData);
    
            // Post studentaccount data
            await axios.post('https://pcg81mqc-3001.asse.devtunnels.ms/studentaccount', {
                username: formData.username,
                password: formData.password,
            });
    
            alert('Form data sent successfully');
            alert('Username and password sent successfully');
            resetForm();
            navigate('/StudentLogin');
        } catch (error) {
            console.error('Error:', error);
            alert('Error occurred during registration');
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <div className="container">
                <h1 className="center-text">Student Register</h1>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="schoolId">School ID:</label>
                        <input
                            type="text"
                            id="schoolId"
                            name="schoolId"
                            placeholder="Enter your school ID"
                            value={formData.schoolId}
                            onChange={handleInputChange}
                        />
                        {schoolIdExists && <div className="error">School ID already exists</div>}
                        {errorMessage && <div className="error">{errorMessage}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="lastname">Last Name:</label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            placeholder="Enter your last name"
                            value={formData.lastname}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="course">Course:</label>
                        <select
                            id="course"
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                        >
                            <option value="">Select course</option>
                            <option value="BSCS">BSCS</option>
                            <option value="BSBA">BSBA</option>
                            <option value="BSTM">BSTM</option>
                            <option value="BSHM">BSHM</option>
                            <option value="BSED">BSED</option>
                            <option value="BSPOLSCI">BSPOLSCI</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstname">First Name:</label>
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            placeholder="Enter your first name"
                            value={formData.firstname}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="section">Section:</label>
                        <input
                            type="text"
                            id="section"
                            name="section"
                            placeholder="Enter your section"
                            value={formData.section}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="middleInitial">M.I:</label>
                        <input
                            type="text"
                            id="middleInitial"
                            name="middleInitial"
                            maxLength="1"
                            placeholder="Enter your middle initial"
                            value={formData.middleInitial}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="year">Year Level:</label>
                        <select
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                        >
                            <option value="">Select year level</option>
                            <option value="1ST YEAR">1ST YEAR</option>
                            <option value="2ND YEAR">2ND YEAR</option>
                            <option value="3RD YEAR">3RD YEAR</option>
                            <option value="4TH YEAR">4TH YEAR</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="age">Age:</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            placeholder="Enter your age"
                            value={formData.age}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact">Contact:</label>
                        <input
                            type="text"
                            id="contact"
                            name="contact"
                            placeholder="Enter your contact number"
                            value={formData.contact}
                            onChange={handleInputChange}
                        />
                    </div>

                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>

                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleInputChange}
                            
                        />
                {usernameExists && <div className="error">Username already exists</div>}
                {errorMessage && <div className="error">{errorMessage}</div>}
                    </div>

                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />

                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <button type="submit">Register</button>
            </div>
            <footer>
                <p>© SCCInventory - For school purpose only</p>
            </footer>
        </form>
    );
};
export default RegistrationForm;
