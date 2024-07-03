import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa'; // Importing icons

const itemsPerPage = 5; // Number of items to display per page

const getStatusIcon = (status) => {
  switch (status) {
    case 'succeeded':
      return <FaCheckCircle className="text-green-500" />;
    case 'failed':
      return <FaTimesCircle className="text-red-500" />;
    case 'pending':
      return <FaHourglassHalf className="text-yellow-500" />;
    default:
      return null;
  }
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transaction/get', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(transactions.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4" style={{ fontFamily: 'inter' }}>
 
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <select className="border rounded p-2">
            <option>Last month</option>
            <option>This week</option>
          </select>
          <select className="border rounded p-2">
            <option>This week</option>
            <option>Last month</option>
          </select>
        </div>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
            Export report
          </button>
          <button className="bg-green-500 text-white rounded p-2 hover:bg-green-600">
            Download
          </button>
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Name of Customer</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Product Name</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Quantity</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Amount</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Date</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="px-6 py-4 border-b border-gray-200">{transaction.buyer.username}</td>
             <td className="border px-4 py-2">
                    {transaction.products.map((product) => (
                      <div key={product._id}>
                        {product.product.name}
                      </div>
                    ))}
                  </td>
              <td className="border px-4 py-2">
                    {transaction.products.map((product) => (
                      <div key={product._id}>
                        {product.quantity}
                      </div>
                    ))}
                  </td>
              <td className="px-6 py-4 border-b border-gray-200">{transaction.totalPrice}</td>
              <td className="px-6 py-4 border-b border-gray-200">{new Date(transaction.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 border-b border-gray-200 flex ">
                {getStatusIcon(transaction.status)} {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={previousPage}
          disabled={currentPage === 1}
          className={`p-2 border rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Previous
        </button>
        <span className="p-2">
          Page {currentPage} of {Math.ceil(transactions.length / itemsPerPage)}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(transactions.length / itemsPerPage)}
          className={`p-2 border rounded ${currentPage === Math.ceil(transactions.length / itemsPerPage) ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionList;
