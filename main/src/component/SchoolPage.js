import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../SchoolPage.css'; // Import the external CSS file
import logoImage from '../img/sccinventory.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

const SchoolPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDoubleClickMenu = () => {
    setIsMenuOpen(false); // Close the menu on double click
  };

  const handleStudentButtonClick = () => {
    navigate('/StudentLogin');
  };

  const handleTeacherButtonClick = () => {
    navigate('/TeacherLogin');
  };

  return (
    <div>
      <div id="middleBox">
        <img id="logo" src={logoImage} alt="School Logo" />
        <p>Welcome! Student & Teacher Welcome to School of Caloocan!</p>
        <div id="buttonContainer">
          <button className="schoolButton studentButton" onClick={handleStudentButtonClick}>
            Student
          </button>
          <button className="schoolButton teacherButton" onClick={handleTeacherButtonClick}>
            Teacher
          </button>
        </div>
      </div>

      <div id="menu" onClick={toggleMenu} onDoubleClick={handleDoubleClickMenu}>
  <div className={isMenuOpen ? 'menuIcon open' : 'menuIcon'}>
    <div className="bar"></div>
    <div className="bar"></div>
    <div className="bar"></div>
  </div>
</div>

      {isMenuOpen && (
        <div id="menuDrop" ref={menuRef} className="vertical-menu">
        <Link to="/SupportTicket">
          <FontAwesomeIcon icon={faAngleRight} style={{ marginRight: '5px' }} />
          Report
        </Link>
        <Link to="/TeacherLogin">
          <FontAwesomeIcon icon={faAngleRight} style={{ marginRight: '5px' }} />
          Report
        </Link>
        <Link to="/CalendarPage">
          <FontAwesomeIcon icon={faAngleRight} style={{ marginRight: '5px' }} />
          Report
        </Link>
      </div>  
      )}
    </div>
  );
};

export default SchoolPage;
