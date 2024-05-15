import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Teacherreg.css';

const TeacherRegistrationForm = () => {
    const [formData, setFormData] = useState({
        teacherId: '',
        email: '',
        lastname: '',
        firstname: '',
        middleInitial: '',
        age: '',
        contact: ''

    });
    const [errorMessage, setErrorMessage] = useState('');
    const [usernameExists, setUsernameExists] = useState(false);
    const [teacherIdExists, setTeacherIdExists] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
        setUsernameExists(false); // Reset usernameExists when input changes
        setTeacherIdExists(false); // Reset teacherIdExists when input changes
    };

    const checkUsernameExists = async (username) => {
        const response = await fetch(`https://pcg81mqc-3002.asse.devtunnels.ms/teacher/exists?username=${username}`);
        const data = await response.json();
        return data.usernames.includes(username);
    };

    const checkTeacherIdExists = async (teacherId) => {
        const response = await fetch(`https://pcg81mqc-3002.asse.devtunnels.ms/teachersid/exist?teacherIds=${teacherId}`);
        const data = await response.json();
        return data.teacherIds.includes(teacherId);
    };

    const checkUsername = useCallback(async () => {
        try {
            setUsernameExists(await checkUsernameExists(formData.username));
        } catch (error) {
            console.error('Error checking username:', error);
            setUsernameExists(false);
        }
    }, [formData.username]);

    const checkTeacherId = useCallback(async () => {
        try {
            setTeacherIdExists(await checkTeacherIdExists(formData.teacherId));
        } catch (error) {
            console.error('Error checking teacher ID:', error);
            setTeacherIdExists(false);
        }
    }, [formData.teacherId]);

    useEffect(() => {
        if (formData.username) {
            checkUsername();
        } else {
            setUsernameExists(false); // Reset usernameExists if username is empty
        }

        if (formData.teacherId) {
            checkTeacherId();
        } else {
            setTeacherIdExists(false); // Reset teacherIdExists if teacherId is empty
        }
    }, [formData.username, formData.teacherId, checkUsername, checkTeacherId]);

    const resetForm = () => {
        setFormData({
            teacherId: '',
            email: '',
            lastname: '',
            department: '',
            firstname: '',
            contract: '',
            middleInitial: '',
            age: '',
            username: '',
            password: '',
            confirmPassword: 'c'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        setErrorMessage(''); // Reset error message
    
        let usernameExists = false;
        let teacherIdExists = false;
    
        // Check if the username exists
        try {
            const usernameResponse = await fetch(`https://pcg81mqc-3002.asse.devtunnels.ms/teacher/exists?username=${formData.username}`);
            const usernameData = await usernameResponse.json();
            usernameExists = usernameData.usernames.includes(formData.username);
        } catch (error) {
            console.error('Error checking username:', error);
            setErrorMessage('Error checking username');
            return;
        }
    
        // Check if the teacher ID exists
        try {
            const teacherIdResponse = await fetch(`https://pcg81mqc-3002.asse.devtunnels.ms/teachersid/exist?teacherIds=${formData.teacherId}`);
            const teacherIdData = await teacherIdResponse.json();
            teacherIdExists = teacherIdData.exists;
        } catch (error) {
            console.error('Error checking teacher ID:', error);
            setErrorMessage('Error checking teacher ID');
            return;
        }
    
        // Show different alerts based on the existence of username and teacher ID
        if (usernameExists && teacherIdExists) {
            alert('Username and Teacher ID already exist');
            return;
        } else if (usernameExists) {
            alert('Username already exists');
            return;
        } else if (teacherIdExists) {
            alert('Teacher ID already exists');
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
            // Post teacherprofile data
            await axios.post('https://pcg81mqc-3002.asse.devtunnels.ms/teacherprofile', formData);
    
            // Post teacheraccount data
            await axios.post('https://pcg81mqc-3002.asse.devtunnels.ms/teacheraccount/register', {
                username: formData.username,
                password: formData.password,
            });
    
            alert('Form data sent successfully');
            alert('Username and password sent successfully');
            resetForm();
            navigate('/TeacherLogin');
        } catch (error) {
            console.error('Error:', error);
            alert('Error occurred during registration');
        }
    };


    return (
        <div className="container4">
            <h1>Teacher Registration Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-row4">
                    <div className="form-group4">
                        <label htmlFor="teacherId">Teacher ID:</label>
                        <input
                            type="text"
                            id="teacherId"
                            name="teacherId"
                            placeholder="Enter your teacher ID"
                            value={formData.teacherId}
                            onChange={handleInputChange}
                        />
                      {teacherIdExists && <div className="error">Teacher ID already exists</div>}
{errorMessage && <div className="error">{errorMessage}</div>}

                            
                    </div>
                    <div className="form-group4">
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
            <div className="form-group4">
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
            <div className="form-group4">
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
            <div className="form-group4">
              <label htmlFor="department">Department:</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Select department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Political Science">Political Science</option>
                <option value="Humanities">Humanities</option>
                <option value="Education">Education</option>
                <option value="Business Administrator">Business Administrator</option>
              </select>
            </div>
            <div className="form-group4">
              <label htmlFor="contact">Contact Number:</label>
              <input
                type="text"
                id="contact"
                name="contact"
                placeholder="Enter your contact number"
                value={formData.contact}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group4">
              <label htmlFor="middleInitial">Middle Initial:</label>
              <input
                type="text"
                id="middleInitial"
                name="middleInitial"
                placeholder="Enter your middle initial"
                value={formData.middleInitial}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group4">
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
            <div className="form-group4">
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
            <div className="form-group4">
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
        </form>
      </div>
);
};

export default TeacherRegistrationForm;
