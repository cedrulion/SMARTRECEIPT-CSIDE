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
    const business = JSON.parse(localStorage.getItem('user')).business
    try {
      const response = await axios.post('http://localhost:5000/api/transaction/get',{business}, {
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
    <div className="flex-1 p-6 ">
      <ToastContainer />
      <h1 className="text-2xl font-bold">Payment processing</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">Product</th>
                <th scope="col" className="px-6 py-3">Payment</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr key={transaction._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {transaction.products.map((product) => (
                      <div key={product._id}>
                        {product.product.name}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4">{transaction.totalPrice}</td>
                  <td className="px-6 py-4">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(transaction.status)}
                      <span className="ml-2">{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
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
        </div>
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
