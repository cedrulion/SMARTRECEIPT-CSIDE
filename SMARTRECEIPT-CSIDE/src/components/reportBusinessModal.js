import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import GenerateBusinessUserReportPDF from '../helpers/businessReportPDF';
import GenerateStockReportPDF from '../helpers/generateStoclReport';
import GenerateEmployeeSalesReportPDF from '../helpers/reportEmployeePDF';

const BusinessReportModal = ({ isOpen, onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [user, setUser] = useState()
    const [endDate, setEndDate] = useState('');
    const [count, setCount] = useState([]);
    const [activeTab, setActiveTab] = useState('transactions');
    const [productStartDate,setProductStartDate]=useState()
    const [productEndDate,setProductEndDate]=useState()
    const [countProducts, setCountProducts] = useState([]);
    const [employeeStartDate,setEmployeeStartDate]=useState()
    const [employeeEndDate,setEmployeeEndDate]=useState()
    const [countEmployees, setCountEmployees] = useState([]);

    const handlePrint = () => {
        GenerateBusinessUserReportPDF(count,user);
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

    const handleProductPrint = () => {
        GenerateStockReportPDF(countProducts,user);
    };
    const handleProductEndDateChange = async (e) => {
        const business = JSON.parse(localStorage.getItem('user')).business
        const value = e.target.value;
        setProductEndDate(value);
        try {
            const response = await axios.post('http://localhost:5000/api/transaction/product/date-range', { startDate:productStartDate, endDate: value,business });
            console.log(response.data);
            setCountProducts(response.data);
        } catch (error) {
            console.log(error);
            toast.error('Server error');
        }
    };

    const handleEmployeesPrint = () => {
        GenerateEmployeeSalesReportPDF(countEmployees,user);
    };
    const handleEmployeeEndDateChange = async (e) => {
        const business = JSON.parse(localStorage.getItem('user')).business
        const value = e.target.value;
        setEmployeeEndDate(value);
        try {
            const response = await axios.post('http://localhost:5000/api/transaction/employee/date-range', { startDate:employeeStartDate, endDate: value,business });
            console.log(response.data);
            setCountEmployees(response.data);
        } catch (error) {
            console.log(error);
            toast.error('Server error');
        }
    };

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")).username
        console.log(loggedInUser);
        setUser(loggedInUser)
    }, [])

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`} style={{ fontFamily: 'inter' }}>
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Reporting</h2>
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
                                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'transactions' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'}`}
                                onClick={() => setActiveTab('transactions')}
                                type="button"
                                role="tab"
                            >
                                Transactions Report
                            </button>
                        </li>
                        <li className="mr-2" role="presentation">
                            <button
                                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'products' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'}`}
                                onClick={() => setActiveTab('products')}
                                type="button"
                                role="tab"
                            >
                                Product Report
                            </button>
                        </li>
                        <li className="mr-2" role="presentation">
                            <button
                                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'employeeSales' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'}`}
                                onClick={() => setActiveTab('employeeSales')}
                                type="button"
                                role="tab"
                            >
                                Employee Sales Report
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'transactions' && (
                        <div className="p-4 rounded-lg bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Transactions done during the selected period:
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                {count.length === 0 ? (
                                    <p>No transactions found.</p>
                                ) : (
                                    <p>{count.length} transactions found.</p>
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
                                <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none">Print</button>
                                <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none">Cancel</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="p-4 rounded-lg bg-gray-50">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Product report
                            </p>
                            <div className="p-4 rounded-lg bg-gray-50 ">
                                <p className="text-sm text-gray-500 ">
                                    Product in/out flow:
                                </p>
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    {count.length === 0 ? (
                                        <p>No products found.</p>
                                    ) : (
                                        <p>{countProducts.length} product found.</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
                                    <input type="date" id="startDate" className="mt-1 p-2 border border-gray-300 rounded-md" value={productStartDate} onChange={(e) => setProductStartDate(e.target.value)} />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
                                    <input type="date" id="endDate" className="mt-1 p-2 border border-gray-300 rounded-md" value={productEndDate} disabled={!productStartDate} onChange={handleProductEndDateChange} />
                                </div>
                                <div className="flex justify-end">
                                    <button onClick={handleProductPrint} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none">Print</button>
                                    <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'employeeSales' && (
                        <div className="p-4 rounded-lg bg-gray-50 ">
                            <p className="text-sm text-gray-500 ">
                                Employee
                            </p>
                            <div className="p-4 rounded-lg bg-gray-50 ">
                                <p className="text-sm text-gray-500">
                                    Employees sales report
                                </p>
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    {countEmployees.length === 0 ? (
                                        <p>No employee sales report found.</p>
                                    ) : (
                                        <p>{countEmployees.length} sales report found.</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
                                    <input type="date" id="startDate" className="mt-1 p-2 border border-gray-300 rounded-md" value={employeeStartDate} onChange={(e) => setEmployeeStartDate(e.target.value)} />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
                                    <input type="date" id="endDate" className="mt-1 p-2 border border-gray-300 rounded-md" value={employeeEndDate} disabled={!employeeStartDate} onChange={handleEmployeeEndDateChange} />
                                </div>
                                <div className="flex justify-end">
                                    <button onClick={handleEmployeesPrint} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none">Print</button>
                                    <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BusinessReportModal;
