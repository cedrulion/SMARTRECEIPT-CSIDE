import React, { useEffect, useState } from 'react';
import { FaHome, FaReceipt, FaBoxes, FaCogs, FaBell, FaChartLine } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Frame from '../Assets/Frame.png';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [activeItem, setActiveItem] = useState("/dashboard/dashboardd");
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch user role from localStorage
    const fetchUserRole = () => {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      if (loggedInUser) {
        setUserRole(loggedInUser.role);
      }
    };

    fetchUserRole();
  }, []);

  const handleItemClick = (path) => {
    setActiveItem(path);
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 w-56 shadow-lg" style={{ fontFamily: 'inter' }}>
      <img src={Frame} alt="logo" className="h-16 object-cover mx-2 rounded-lg shadow-md" />
      <nav className="mt-10">
        {userRole === 'RRA' && (
          <>
            <Link
              to="/dashboard/dashboardd"
              onClick={() => handleItemClick('/dashboard/dashboardd')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/dashboardd' ? 'bg-gray-200' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/dashboardd' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/dashboardd' ? '4px solid #8155ff' : '',
              }}
            >
              <FaHome className="mr-3" /> Dashboard
            </Link>
            <Link
              to="/dashboard/list"
              onClick={() => handleItemClick('/dashboard/list')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/list' ? 'bg-gray-200' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/list' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/list' ? '4px solid #8155ff' : '',
              }}
            >
              <FaReceipt className="mr-3" /> Transactions
            </Link>
            <Link
              to="/dashboard/blist"
              onClick={() => handleItemClick('/dashboard/blist')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/blist' ? 'bg-gray-200' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/blist' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/blist' ? '4px solid #8155ff' : '',
              }}
            >
              <FaCogs className="mr-3" /> Business Information
            </Link>
            <Link
              to="/dashboard/message"
              onClick={() => handleItemClick('/dashboard/transactions')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/transactions' ? 'bg-gray-200' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/transactions' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/transactions' ? '4px solid #8155ff' : '',
              }}
            >
              <FaReceipt className="mr-3" /> Messages
            </Link>
          </>
        )}
        {userRole === 'BUSINESS' && (
          <>
            <Link
              to="/dashboard/dashboardd"
              onClick={() => handleItemClick('/dashboard/dashboardd')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/dashboardd' ? 'bg-gray-200' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/dashboardd' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/dashboardd' ? '4px solid #8155ff' : '',
              }}
            >
              <FaHome className="mr-3" /> Dashboard
            </Link>
            <Link
              to="/dashboard/transactions"
              onClick={() => handleItemClick('/dashboard/transactions')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/transactions' ? 'bg-gray-200' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/transactions' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/transactions' ? '4px solid #8155ff' : '',
              }}
            >
              <FaReceipt className="mr-3" /> Transactions
            </Link>
            <Link
              to="/dashboard/product"
              onClick={() => handleItemClick('/dashboard/product-catalog')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/product-catalog' ? 'bg-gray-200' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/product-catalog' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/product-catalog' ? '4px solid #8155ff' : '',
              }}
            >
              <FaBoxes className="mr-3" /> Product Catalog
            </Link>
            <Link
              to="/dashboard/info"
              onClick={() => handleItemClick('/dashboard/info')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/info' ? 'bg-gray-200' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/info' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/info' ? '4px solid #8155ff' : '',
              }}
            >
              <FaCogs className="mr-3" /> Business Information
            </Link>
            <Link
              to="/dashboard/payment"
              onClick={() => handleItemClick('/dashboard/payment')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/payment' ? 'bg-gray-200' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/payment' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/payment' ? '4px solid #8155ff' : '',
              }}
            >
              <FaBell className="mr-3" /> Payment Process
            </Link>
            <Link
              to="/dashboard/report"
              onClick={() => handleItemClick('/dashboard/report')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/report' ? 'bg-gray-200' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/report' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/report' ? '4px solid #8155ff' : '',
              }}
            >
              <FaChartLine className="mr-3" /> Report
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;