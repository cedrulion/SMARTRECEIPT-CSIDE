import React, { useState } from 'react';
import { FaBell, FaCaretDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from './header';

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
          <div
            className="w-8 h-8 rounded-full mr-2"
          >
            <i className="fa-regular fa-user" style={{fontSize:"1.5em"}}></i>
            </div>
          <span className="font-semibold">{loggedInUser.username}</span>
          <FaCaretDown className="ml-2" />
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 z-10">
            <HeaderComponent logout={handleLogout} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;