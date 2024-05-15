// NotificationList.js
import React from 'react';
import Notification from './Notification'; // Assuming Notification component is in a separate file
import '../NotificationList.css';


const NotificationList = ({ notifications, handleNotificationOpen, handleMarkAsRead }) => (
  <div className="notification-list">
    {notifications.map((notification) => (
      <Notification
        key={notification.id}
        notification={notification}
        handleNotificationOpen={handleNotificationOpen}
        handleMarkAsRead={handleMarkAsRead}
      />
    ))}
  </div>
);

export default NotificationList;
