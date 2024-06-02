import React, { useState } from 'react';
import { FaBell, FaCaretDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      <div>
        <h1 className='text-xl font-bold ml-6'>Overview</h1>
      </div>
      <div className="flex items-center ml-5">
        <input
          type="text"
          placeholder="Search here..."
          className="px-2 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center relative">
        <div className="flex items-center cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <img
            src="https://via.placeholder.com/150"
            alt="User Avatar"
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="font-semibold">{loggedInUser.username}</span>
          <FaCaretDown className="ml-2" />
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
