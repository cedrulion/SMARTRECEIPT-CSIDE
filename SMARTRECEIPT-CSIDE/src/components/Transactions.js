import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    tinNumber: '',
    username: '',
    productId: '',
    quantity: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const token = localStorage.getItem('token');

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transaction/transactions/get', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch transactions');
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/product/getproducts', {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prevTransaction) => ({
      ...prevTransaction,
      [name]: value,
    }));
  };

  const handleAddTransaction = async () => {
    try {
      await axios.post('http://localhost:5000/api/transaction/transactions/add', newTransaction, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      toast.success('Transaction added successfully');
      setNewTransaction({
        tinNumber: '',
        username: '',
        productId: '',
        quantity: '',
      });
      setModalIsOpen(false);
      fetchTransactions();
    } catch (error) {
      toast.error('Error adding transaction');
    }
  };

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

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    doc.text('Transactions', 20, 20);
    doc.autoTable({
      head: [['Username', 'Product', 'Quantity', 'Total Price', 'Date', 'Status']],
      body: transactions.map((transaction) => [
        transaction.buyer.username,
        transaction.product.name,
        transaction.quantity,
        transaction.totalPrice,
        new Date(transaction.date).toLocaleDateString(),
        transaction.status,
      ]),
    });
    doc.save('transactions.pdf');
  };

  const handleExportReceipt = () => {
    const csvData = [
      ['Username', 'Product', 'Quantity', 'Total Price', 'Date', 'Status'],
      ...transactions.map((transaction) => [
        transaction.buyer.username,
        transaction.product.name,
        transaction.quantity,
        transaction.totalPrice,
        new Date(transaction.date).toLocaleDateString(),
        transaction.status,
      ]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      csvData.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
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
      <button onClick={() => setModalIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Add Transaction</button>
      <button onClick={handleDownloadReceipt} className="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-2">Download Receipt</button>
      <button onClick={handleExportReceipt} className="bg-purple-500 text-white px-4 py-2 rounded mt-4 ml-2">Export Receipt</button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
        <h2>Add New Transaction</h2>
        <div className="my-4">
          <label htmlFor="tinNumber">TIN Number</label>
          <input type="text" id="tinNumber" name="tinNumber" value={newTransaction.tinNumber} onChange={handleInputChange} />
        </div>
        <div className="my-4">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={newTransaction.username} onChange={handleInputChange} />
        </div>
        <div className="my-4">
          <label htmlFor="productId">Product</label>
          <select id="productId" name="productId" value={newTransaction.productId} onChange={handleInputChange}>
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>{product.name}</option>
            ))}
          </select>
        </div>
        <div className="my-4">
          <label htmlFor="quantity">Quantity</label>
          <input type="number" id="quantity" name="quantity" value={newTransaction.quantity} onChange={handleInputChange} />
        </div>
        <button onClick={handleAddTransaction} className="bg-blue-500 text-white px-4 py-2 rounded">Add Transaction</button>
      </Modal>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
                  <td className="px-6 py-4 border-b border-gray-200">{transaction.product.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{transaction.quantity}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{transaction.totalPrice}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      {getStatusIcon(transaction.status)}
                      <span className="ml-2">{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                    </div>
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

export default Transactions;
