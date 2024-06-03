import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const Payment = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const token = localStorage.getItem('token');

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transaction/get', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      // Filter only pending transactions
      const pendingTransactions = response.data.filter(transaction => transaction.status);
      setTransactions(pendingTransactions);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch transactions');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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

  const handlePay = async (transactionId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/payment/payments', { transactionId }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.log(error);
      toast.error('Failed to initiate payment');
    }
  };

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(transactions.length / transactionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-100">
      <ToastContainer />
      <h1 className="text-2xl font-bold">Transactions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-200 mt-4">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Product</th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Payment</th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Date</th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Status</th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="px-6 py-4 border-b border-gray-200">{transaction.product.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{transaction.totalPrice}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      {getStatusIcon(transaction.status)}
                      <span className="ml-2">{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {transaction.status === 'succeeded' ? (
                      <button className="bg-gray-500 text-white px-4 py-2 rounded">Done</button>
                    ) : (
                      <button onClick={() => handlePay(transaction._id)} className="bg-green-500 text-white px-4 py-2 rounded">Pay</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-gray-500 text-white px-4 py-2 rounded">
              Previous
            </button>
            <button onClick={handleNextPage} disabled={currentPage === Math.ceil(transactions.length / transactionsPerPage)} className="bg-gray-500 text-white px-4 py-2 rounded">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Payment;
