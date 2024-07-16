import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaTrash } from 'react-icons/fa';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleOpenDetailModal = (product) => {
    console.log(product)
    setSelectedProduct(product);
    setDetailModalIsOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalIsOpen(false);
    setSelectedProduct(null);
  };

  const token = localStorage.getItem('token');

  const fetchTransactions = async () => {
    const business = JSON.parse(localStorage.getItem('user')).business
    try {
      const response = await axios.post('http://localhost:5000/api/transaction/business/get/transactions', { business }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      handleError(error, 'Failed to fetch transactions');
    }
  };

  const fetchProducts = async () => {
    const business = JSON.parse(localStorage.getItem('user')).business
    console.log("business", business);
    try {
      const response = await axios.post('http://localhost:5000/api/product/getproducts', { business }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      setLoading(false);
    } catch (error) {
      handleError(error, 'Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const handleError = (error, message) => {
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      toast.error(`${message}: ${error.response.data.message}`);
    } else if (error.request) {
      console.error('Request data:', error.request);
      toast.error('No response received from the server');
    } else {
      console.error('Error message:', error.message);
      toast.error(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Successful</span>
      case 'failed':
        return <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded ">Failed</span>
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Pending</span>
      default:
        return null;
    }
  };



  return (
    <div className="container mx-auto mt-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-3">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">Username</th>
                  <th scope="col" className="px-6 py-3">Total Price</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody >
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{transaction.buyer.username}</td>
                    <td className="px-6 py-4">{transaction.totalPrice}</td>
                    <td className="px-6 py-4">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{getStatusIcon(transaction.status)}</td>
                    <td className="px-6 py-4">
                      <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-5" style={{ cursor: "pointer" }} onClick={() => handleOpenDetailModal(transaction)}>Detailed description</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal
        isOpen={detailModalIsOpen}
        onRequestClose={handleCloseDetailModal}
        contentLabel="Product Details"
        className="bg-white rounded-lg shadow-lg p-6 w-96 mx-auto my-4"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
            <span>Product details</span>
          </div>
          <button onClick={handleCloseDetailModal} className="text-2xl">&times;</button>
        </div>
        <div className='mt-2'>
          {selectedProduct?.products.map((product, index) => (
            <div key={index} className="flex items-center justify-between mb-2 bg-gray-100 p-3 rounded-lg shadow-sm hover:bg-gray-200 transition duration-150 ease-in-out">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-800">{product.product.name}</span>
                <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
                  <span className="text-xs font-semibold text-blue-800 mr-1">Unit price:</span>
                  <span className="text-sm font-bold text-blue-900">{product.product.unitPrice}</span>
                </div>
              </div>
              <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                <span className="text-xs font-semibold text-green-800 mr-1">Items:</span>
                <span className="text-sm font-bold text-green-900">{product.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

    </div>
  );
};

export default Transactions;

