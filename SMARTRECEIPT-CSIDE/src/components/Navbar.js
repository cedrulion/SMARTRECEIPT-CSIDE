import React from 'react';
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
  // Get username from localStorage
  const username = localStorage.getItem('username');

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      <div>
        <h1 className='text-xl font-bold ml-6'>Overview</h1>
      </div>
      <div className="flex items-center ml-5">
        <input
          type="text"
          placeholder="Search here..."
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center">
        <FaBell className="text-gray-600 mr-4" />
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/150"
            alt="User Avatar"
            className="w-8 h-8 rounded-full mr-2"
          />
          {/* Display username dynamically */}
          <span className="font-semibold">{username}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
