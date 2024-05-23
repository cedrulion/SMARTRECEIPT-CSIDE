import React, { useEffect, useState } from 'react';
import { FaHome, FaReceipt, FaBoxes, FaCogs, FaBell, FaChartLine } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Frame from '../Assets/Frame.png';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false)
  const handleItemClick = (path) => {
    navigate(path);
    onClose();
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 w-56  shadow-lg ">
      <img src={Frame} alt="logo" className="h-16 object-cover rounded-lg shadow-md" />
      <nav className="mt-10">
        <Link to="/dashboard/dashboardd" onClick={() => handleItemClick('/dashboard/dashboardd')} className="flex items-center p-2 mt-5">
          <FaHome className="mr-3" /> Dashboard
        </Link>
        <Link to="/dashboard/transactions" onClick={() => handleItemClick('/dashboard/transactions')} className="flex items-center p-2 mt-5">
          <FaReceipt className="mr-3" /> Transactions
        </Link>
        <Link to="/dashboard/product" onClick={() => handleItemClick('/dashboard/product-catalog')} className="flex items-center p-2 mt-5">
          <FaBoxes className="mr-3" /> Product Catalog
        </Link>
        <Link to="/dashboard/info" onClick={() => handleItemClick('/dashboard/info')} className="flex items-center p-2 mt-5">
          <FaCogs className="mr-3" /> Business Information
        </Link>
        <Link to="/dashboard/notifications" onClick={() => handleItemClick('/dashboard/notifications')} className="flex items-center p-2 mt-5">
          <FaBell className="mr-3" /> Notification System
        </Link>
        <Link to="/dashboard/report" onClick={() => handleItemClick('/dashboard/report')} className="flex items-center p-2 mt-5">
          <FaChartLine className="mr-3" /> Report
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
