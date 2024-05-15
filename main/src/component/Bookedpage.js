import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import NotificationList from './NotificationList';
import '../Page.css';
import availableImg from '../img/AVAILABLE.png';
import bookImg from '../img/BOOK.png';
import reportImg from '../img/REPORT.png';
import requestImg from '../img/REQUEST.png';

const NotificationIcon = ({ unreadNotifications, handleBellClick }) => (
  <div className={`notification-icon ${unreadNotifications > 0 ? 'unread' : ''}`} onClick={handleBellClick}>
    <FaBell />
    {unreadNotifications > 0 && <span className="badge">{unreadNotifications}</span>}
  </div>
);

const NotificationContainer = ({ unreadNotifications, handleBellClick, handleLogout }) => {
  const [showNotificationContent, setShowNotificationContent] = useState(false);

  const handleNotificationClick = () => {
    setShowNotificationContent(!showNotificationContent);
  };

  return (
    <div className="notification-container">
      <div className="notification-icon-container">
        <NotificationIcon
          unreadNotifications={unreadNotifications}
          handleBellClick={handleBellClick}
        />
      </div>
      {showNotificationContent && (
        <div className="notification-content" onClick={handleNotificationClick}>
          {/* Notification content goes here */}
          <p>This is a notification</p>
        </div>
      )}
      <div className="logout-container">
        <p className="logout-text" onClick={handleLogout}>Logout</p>
      </div>
    </div>
  );
};

const images = {
  'AVAILABLE': availableImg,
  'BOOK': bookImg,
  'REPORT': reportImg,
  'REQUEST': requestImg,
};

const ItemCard = ({ item, buttonName, destination }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(destination);
  };

  return (
    <div className="item-container">
      <div className="item-card">
        <img src={images[item.image]} alt={item.title} />
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <div className="button-container">
          <button className="item-button" onClick={handleButtonClick}>{buttonName}</button>
        </div>
      </div>
      {/* Transparent smaller container */}
      <div className="smaller-container">
      </div>
    </div>
  );
};

const Bookpage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Book Succesful!', timestamp: '2024-05-10T11:21:08.000Z', read: false },
    { id: 2, message: 'Request Succesful!', timestamp: '2024-05-10T11:21:34.000Z', read: false },
    { id: 3, message: 'Report Send Succesful!', timestamp: '2024-05-10T11:21:37.000Z', read: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await fetch('https://pcg81mqc-3003.asse.devtunnels.ms/onlineusers');
        await response.json();
        // Do something with the online users data if needed
      } catch (error) {
        console.error('Error fetching online users:', error);
      }
    };

    fetchOnlineUsers();
  }, []);

  const handleNotificationOpen = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, isOpen: !notification.isOpen } : notification
      )
    );
  };

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  const unreadNotifications = notifications.filter((notification) => !notification.read).length;

  const handleBellClick = () => {
    setShowNotifications((prevShowNotifications) => !prevShowNotifications);
  };

  const handleLogout = () => {
    alert('Logout successful!');
    navigate('/');
  };

  return (
    <div className="page-container">
      <NotificationContainer
        unreadNotifications={unreadNotifications}
        handleBellClick={handleBellClick}
        handleLogout={handleLogout}
      />
      {showNotifications && notifications.length > 0 && (
        <NotificationList
          notifications={notifications}
          handleNotificationOpen={handleNotificationOpen}
          handleMarkAsRead={handleMarkAsRead}
        />
      )}
      {/* Example item cards */}
      <ItemCard
        item={{
          image: 'REQUEST',
          description: 'Request Equipments Here!',
        }}
        buttonName="Request"
        destination="/TicketForm"
      />
      <ItemCard
        item={{
          image: 'BOOK',
          description: 'Book Your Comlab Slot Here!',
        }}
        buttonName="Book"
        destination="/StudentLogin"
      />
      <ItemCard
        item={{
          image: 'AVAILABLE',
          description: 'Check Availabilities of slot here!',
        }}
        buttonName="Check"
        destination="/request-page"
      />
      <ItemCard
        item={{
          image: 'REPORT',
          description: 'Report Your Problem Here!',
        }}
        buttonName="Report"
        destination="/CalendarPage"
      />
    </div>
  );
};

export default Bookpage;
