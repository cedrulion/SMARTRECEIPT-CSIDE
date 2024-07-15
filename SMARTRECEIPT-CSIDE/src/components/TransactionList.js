import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import GenerateTransactionsPDF from '../helpers/pdf';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaDownload, FaFileExport, FaCalendarAlt } from 'react-icons/fa';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [originalTransactions, setOriginalTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transaction/getall', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        setTransactions(response.data);
        setOriginalTransactions(response.data); // Save original transactions
        setFilteredTransactions(response.data); // Initialize filtered transactions
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  // Update filteredTransactions when startDate or endDate changes
  useEffect(() => {
    filterTransactionsByDateRange(startDate, endDate);
  }, [startDate, endDate]);

  const filterTransactionsByDateRange = (start, end) => {
    if (start && end) {
      const filtered = originalTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= new Date(start) && transactionDate <= new Date(end);
      });
      setFilteredTransactions(filtered);
    } else {
      // Reset to original transactions if startDate or endDate is empty
      setFilteredTransactions(originalTransactions);
    }
  };

  function exportTransactions() {
    const headers = ["Customer name", "Business Name", "Date", "Total price"];
    const data = filteredTransactions.map(transaction => ({
        "Customer name": transaction.buyer?.username,
        "Business Name": transaction.business?.businessName,
        "Date": new Date(transaction.date).toLocaleDateString(),
        "Total price": transaction.totalPrice
    }));
    const sheetData = [headers, ...data.map(Object.values)];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, 'transactions.xlsx');
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Active</span>;
      case 'failed':
        return <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded ">Failed</span>;
      case 'pending':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Not active</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4" style={{ fontFamily: 'inter' }}>
      <p className='mb-2'>Showing transaction for</p>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="border rounded p-2 pl-10"
              placeholder="Start date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="border rounded p-2 pl-10"
              placeholder="End date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="bg-white text-grey-500 border border-grey-500 rounded-lg p-2 hover:bg-blue-50 flex items-center"
            onClick={() => exportTransactions()}
          >
            <FaFileExport className="mr-2" /> Export report
          </button>
          <button className="bg-white text-grey-500 border border-grey-500 rounded-lg p-2 hover:bg-blue-50 flex items-center"
            onClick={() => GenerateTransactionsPDF(filteredTransactions)}
          >
            <FaDownload className="mr-2" /> Download
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Customer name</th>
              <th scope="col" className="px-6 py-3">Business name</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Total price</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{transaction.buyer.username}</td>
                <td className="px-6 py-4">{transaction.business.businessName}</td>
                <td className="px-6 py-4">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">RWF {transaction.totalPrice.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">RWF {transaction.totalPrice}</td>
                <td className="px-6 py-4">{getStatusIcon(transaction.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
