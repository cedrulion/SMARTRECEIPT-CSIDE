import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import generatePDF from '../helpers/pdfReport';


const Modal = ({ isOpen, onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [count, setCount] = useState([]);


    const handlePrint = () => {
        // Implement print functionality here
        generatePDF(count)
    };

    const handleEndDateChange = async (e) => {
        const value = e.target.value;
        setEndDate(value);
        try {
            const response = await axios.post('http://localhost:5000/api/transaction/date-range', { startDate, endDate: value });
            console.log(response.data);
             setCount(response.data);

        } catch (error) {
            console.log(error);
            toast.error('Server error');
        }
    };

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`} style={{ fontFamily: 'inter' }}>
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Reporting</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mb-4">
                    <p className="text-gray-600 mb-2">Transactions done during the selected period:</p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        {count.length === 0 ? (
                            <p>No transactions found.</p>
                        ) : (
                            <p>{count.length} transactions found.</p>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
                    <input type="date" id="startDate" className="mt-1 p-2 border border-gray-300 rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
                    <input type="date" id="endDate" className="mt-1 p-2 border border-gray-300 rounded-md" value={endDate} disabled={!startDate} onChange={handleEndDateChange} />
                </div>
                <div className="flex justify-end">
                    <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none">Print</button>
                    <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none">Cancel</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Modal;
