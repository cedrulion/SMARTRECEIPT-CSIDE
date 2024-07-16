import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import GenerateRwandaRevenuePDFReport from '../helpers/rraTransactionsReport';
import GenerateRwandaRevenueBusinessPDFReport from '../helpers/rraBusinessReport';


const RwandaRevenueAuthorityReportModal = ({ isOpen, onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bstartDate, setbStartDate] = useState('');
    const [bendDate, setbEndDate] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [businessReports, setBusinessReports] = useState([]);
    const [activeTab, setActiveTab] = useState('allTransactions');


    const handlePrintTransactions = () => {
        GenerateRwandaRevenuePDFReport(transactions);
    };

    const handlePrintBusinessReports = () => {
        GenerateRwandaRevenueBusinessPDFReport(businessReports);
    };

    const handleEndDateChange = async (e) => {
        const value = e.target.value;
        setEndDate(value);
        try {
            const response = await axios.post('http://localhost:5000/api/transaction/transaction/rra/date-range', { startDate, endDate: value });
            console.log(response.data);
            setTransactions(response.data);
        } catch (error) {
            console.log(error);
            toast.error('Server error');
        }
    };

    const handleBusinessEndDateChange = async (e) => {
        const value = e.target.value;
        setbEndDate(value);
        try {
            const response = await axios.post('http://localhost:5000/api/transaction/business/date-range', { startDate:bstartDate, endDate: value });
            console.log(response.data);
            setBusinessReports(response.data);
        } catch (error) {
            console.log(error);
            toast.error('Server error');
        }
    };

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`} style={{ fontFamily: 'inter' }}>
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Rwanda Revenue Authority Reporting</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                    <ul
                        className="flex flex-wrap -mb-px text-sm font-medium text-center"
                        role="tablist"
                    >
                        <li className="mr-2" role="presentation">
                            <button
                                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'allTransactions' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'}`}
                                onClick={() => setActiveTab('allTransactions')}
                                type="button"
                                role="tab"
                            >
                                All Transactions
                            </button>
                        </li>
                        <li className="mr-2" role="presentation">
                            <button
                                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'businessReports' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'}`}
                                onClick={() => setActiveTab('businessReports')}
                                type="button"
                                role="tab"
                            >
                                Business Reports
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'allTransactions' && (
                        <div className="p-4 rounded-lg bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Transactions done during the selected period:
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                {transactions.length === 0 ? (
                                    <p>No transactions found.</p>
                                ) : (
                                    <p>{transactions.length} transactions found.</p>
                                )}
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
                                <button onClick={handlePrintTransactions} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none">Print</button>
                                <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none">Cancel</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'businessReports' && (
                        <div className="p-4 rounded-lg bg-gray-50">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Business Reports during the selected period:
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                {businessReports.length === 0 ? (
                                    <p>No business reports found.</p>
                                ) : (
                                    <p>{businessReports.length} business reports found.</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
                                <input type="date" id="startDate" className="mt-1 p-2 border border-gray-300 rounded-md" value={bstartDate} onChange={(e) => setbStartDate(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
                                <input type="date" id="endDate" className="mt-1 p-2 border border-gray-300 rounded-md" value={bendDate} disabled={!bstartDate} onChange={handleBusinessEndDateChange} />
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handlePrintBusinessReports} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none">Print</button>
                                <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default RwandaRevenueAuthorityReportModal;
