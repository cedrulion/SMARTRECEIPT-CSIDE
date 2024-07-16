import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';

const NotificationPanel = ({ show, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem('token');
    const fetchNotifications = async () => {
        const business = JSON.parse(localStorage.getItem('user')).business
        try {
            const response = await axios.post(`http://localhost:5000/api/notification/get/notifications`, { business }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            })
            console.log(response.data);
            setNotifications(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch notifications", {
                position: "top-left",
                autoClose: 5000
            });
        }
    };
    useEffect(() => {
        fetchNotifications();
    }, []);

    const panelStyles = {
        width: '35vw',
        height: '100vh',
        position: 'fixed',
        right: show ? '0' : '-35vw',
        top: '0',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        padding: '20px',
        zIndex: '1000',
        display: 'flex',
        // inset:100,
        flexDirection: 'column',
        transition: 'right 0.3s ease-in-out'
    };

    const handleApprove = async (notificationId) => {
        
        try {
            await axios.post(`http://localhost:5000/api/notification/approve`, { notificationId }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            })
            fetchNotifications();
            toast.success("Notification approved successfully", {
                position: "top-left",
                autoClose: 5000
            });
            // Update local state or fetch notifications again to reflect the change
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve notification", {
                position: "top-left",
                autoClose: 5000
            });
        }
    };

    return (
        <div style={panelStyles}>
            <div>
                <h5 className='text-primary'>Notifications</h5>
                <hr />
                <ul className="space-y-4 mt-2">
                    {notifications.map(notification => (
                        <li key={notification._id} className="p-4 bg-white rounded-lg shadow hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                            <div>
                                <strong>Transaction ID:</strong> {notification.transaction._id}
                                <br />
                                <strong>Requested On:</strong> {new Date(notification.createdAt).toLocaleDateString()}
                                <br />
                                <strong>Total Price:</strong> {notification.transaction.totalPrice.toLocaleString()}
                            </div>
                            <button
                                onClick={() => handleApprove(notification._id)}
                                className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
                            >
                                <FaCheckCircle className="h-5 w-5 mr-1" />
                                Approve
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ marginTop: 'auto' }} className='mb-4'>
                <div className="d-flex justify-content-start">
                    <button className="btn btn-secondary mx-2" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;
