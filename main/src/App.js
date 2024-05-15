import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLogin from './component/StudentLogin';
import RegistrationForm from './component/RegistrationForm';
import LoginForm from './component/LoginForm';
import SchoolPage from './component/SchoolPage';
import Bookpage from './component/Bookpage';
import SupportTicket from './component/SupportTicket';
import ThanksTicket from './component/ThanksTicket';
import TicketForm from './component/TicketForm';
import CalendarPage from './component/CalendarPage';
import TeacherLogin from './component/TeacherLogin';
import TeacherRegistrationForm from './component/TeacherReg';
import Bookedpage from './component/Bookedpage';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SchoolPage />} />
                <Route path="/StudentLogin" element={<StudentLogin />} />
                <Route path="/registration" element={<RegistrationForm />} />
                <Route path="/LoginForm" element={<LoginForm />} />
                <Route path="/Bookpage" element={<Bookpage />} />
                <Route path="/SupportTicket" element={<SupportTicket />} />
                <Route path="/ThanksTicket" element={<ThanksTicket />} />
                <Route path="/TicketForm" element={<TicketForm />} />
                <Route path="/CalendarPage" element={<CalendarPage/>} />
                <Route path="/TeacherLogin" element={<TeacherLogin/>} />
                <Route path="/TeacherReg" element={<TeacherRegistrationForm/>} />
                <Route path="/Bookedpage" element={<Bookedpage/>} />
            </Routes>
        </Router>
    );
}

export default App;
