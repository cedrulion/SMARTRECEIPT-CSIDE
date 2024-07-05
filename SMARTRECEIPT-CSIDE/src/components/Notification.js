// src/components/Notification.js
import React from 'react';
import { FaBell } from 'react-icons/fa';

const Notification = ({ count }) => {
  return (
    <div className="relative">
      <FaBell className="text-2xl" />
      {count > 0 && (
        <span className="absolute top-0 right-0 inline-block w-2 h-2 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"></span>
      )}
    </div>
  );
};

export default Notification;
