import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBars, } from 'react-icons/fa';
import Navbar from './Navbar';
import NotificationPanel from './duplicateNotifications';


const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const toggleTrigger = () => {
      setShowTrigger(!showTrigger);
  };
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage on logout
    navigate('/signin'); // Redirect to signin page
  };

  return (
    <>
    <div className="">
      {isSidebarOpen && <Sidebar onClose={toggleSidebar} trigger={toggleTrigger} />}

      <div className={`flex-grow ${isSidebarOpen ? 'ml-56' : 'ml-0'}`}>
        <div className='font-roboto'>
          <Navbar/>
          <Outlet/>
          </div>
      
      </div>
    </div>
    <NotificationPanel show={showTrigger} onClose={toggleTrigger} />
    </>
  );
};

export default DashboardLayout;
