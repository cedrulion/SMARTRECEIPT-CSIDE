import React, { useEffect, useState } from 'react';
import { FaHome, FaReceipt, FaBoxes, FaCogs, FaBell, FaChartLine } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Frame from '../Assets/Frame.png';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
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
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 w-56 shadow-lg font-roboto">
      <img src={Frame} alt="logo" className="h-16 object-cover rounded-lg shadow-md" />
      <nav className="mt-10">
{userRole === 'RRA' && (
          <>
        <Link to="/dashboard/dashboardd" onClick={() => handleItemClick('/dashboard/dashboardd')} className="flex items-center p-2 mt-5">
          <FaHome className="mr-3" /> Dashboard
        </Link>
        <Link to="/dashboard/list" onClick={() => handleItemClick('/dashboard/list')} className="flex items-center p-2 mt-5">
          <FaReceipt className="mr-3" /> Transactions
        </Link>
 <Link to="/dashboard/blist" onClick={() => handleItemClick('/dashboard/blist')} className="flex items-center p-2 mt-5">
              <FaCogs className="mr-3" /> Business Information
            </Link>
       <Link to="/dashboard/message" onClick={() => handleItemClick('/dashboard/transactions')} className="flex items-center p-2 mt-5">
          <FaReceipt className="mr-3" /> Messages
        </Link>
       </>
)}
        {userRole === 'BUSINESS' && (
          <>
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
          <Link to="/dashboard/payment" onClick={() => handleItemClick('/dashboard/payment')} className="flex items-center p-2 mt-5">
              <FaBell className="mr-3" /> Payment Process
            </Link>
            
            <Link to="/dashboard/report" onClick={() => handleItemClick('/dashboard/report')} className="flex items-center p-2 mt-5">
              <FaChartLine className="mr-3" /> Report
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
