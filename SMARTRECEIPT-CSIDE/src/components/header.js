import { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Modal from './reportModal';

const HeaderComponent = ({ page, logout }) => {
    const [user, setUser] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState("")
    const [showModal, setShowModal] = useState(false);
    const handleReportingClick = () => {
        setShowModal(true);
    };

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('loggedInUser')).username)
        const userData = JSON.parse(localStorage.getItem("loggedInUser"));
        setEmail(userData.email)
        setRole(userData.role)
    }, [])

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ fontFamily: 'inter' }}>
            <div className="px-4 py-3">
                <div className="flex flex-row">
                    <div className='mt-2 mr-3'>
                    <i className="fa-solid fa-user" style={{fontSize:"1.5em"}}></i>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">{email}</p>
                        <p className="text-gray-500 text-sm"><small>{role}</small></p>
                    </div>
                </div>
            </div>
            <hr />
            <div className="px-4 py-3 cursor-pointer hover:bg-gray-100"  onClick={handleReportingClick}>
                <div className='flex flex-row items-center'>
                    <i className="fa-solid fa-calendar-days mr-2"></i>
                    <p className='text-sm text-gray-500'>Reporting</p>
                </div>
            </div>
            <div className="px-4 py-3 cursor-pointer hover:bg-gray-100"  onClick={handleReportingClick}>
                <div className='flex flex-row items-center'>
                <i className="fa-solid fa-lock mr-2"></i>
                    <p className='text-sm text-gray-500'>Change password</p>
                </div>
            </div>
            <div className="px-4 py-3 cursor-pointer hover:bg-gray-100" onClick={() => logout()}>
                <div className='flex flex-row items-center'>
                    <i className="fa-solid fa-right-from-bracket mr-2"></i>
                    <p className='text-sm text-gray-500'>Logout</p>
                </div>
            </div>
            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default HeaderComponent;