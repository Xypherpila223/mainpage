// Notification.js
import React from 'react';


const Notification = ({ notification, handleNotificationOpen, handleMarkAsRead }) => (
  <div className={`notification ${notification.read ? 'read' : 'unread'}`} onClick={() => handleNotificationOpen(notification.id)}>
    <div className="message-container">
      <div className="message">
        <p>{notification.message}</p>
        <p>{notification.timestamp}</p>
        {notification.read ? null : (
          <button onClick={(e) => handleMarkAsRead(e, notification.id)}>Mark as Read</button>
        )}
      </div>
    </div>
  </div>
);

export default Notification;
