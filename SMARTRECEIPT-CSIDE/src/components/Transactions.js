import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaTrash } from 'react-icons/fa';
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
    width: '80%',
    maxHeight: '90vh',
    overflowY: 'auto',
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
    products: [],
  });
  const [currentProduct, setCurrentProduct] = useState({ productId: '', quantity: '' });
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
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      handleError(error, 'Failed to fetch transactions');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prevTransaction) => ({
      ...prevTransaction,
      [name]: value,
    }));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleAddProduct = () => {
    if (currentProduct.productId && currentProduct.quantity) {
      setNewTransaction((prevTransaction) => ({
        ...prevTransaction,
        products: [...prevTransaction.products, currentProduct],
      }));
      setCurrentProduct({ productId: '', quantity: '' });
    } else {
      toast.error('Please select a product and enter a quantity');
    }
  };

  const handleRemoveProduct = (index) => {
    setNewTransaction((prevTransaction) => ({
      ...prevTransaction,
      products: prevTransaction.products.filter((_, i) => i !== index),
    }));
  };

  const handleAddTransaction = async () => {
    try {
      await axios.post('http://localhost:5000/api/transaction/add', newTransaction, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      toast.success('Transaction added successfully');
      setNewTransaction({
        tinNumber: '',
        username: '',
        products: [],
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

  const incrementTransactionCount = async (transactionId) => {
    console.log('Incrementing transaction count for:', transactionId);
    try {
      await axios.put(`http://localhost:5000/api/transaction/incrementcount/${transactionId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      console.log('Transaction count incremented successfully');
    } catch (error) {
      console.error('Failed to increment transaction count', error);
    }
  };

  const checkTransactionCount = async (transactionId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transaction/count/${transactionId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      return response.data.count;
    } catch (error) {
      console.error('Failed to get transaction count', error);
      return -1;
    }
  };

  const handleDownloadReceipt = async (transactionId) => {
    console.log('Downloading receipt for transaction:', transactionId);
    const count = await checkTransactionCount(transactionId);
    if (count < 0) {
      toast.error('Error fetching transaction count');
    } else if (count > 0) {
      toast.error('Duplicate transaction, cannot download');
    } else {
      await incrementTransactionCount(transactionId);
      incrementNotificationCount();
      const doc = new jsPDF();
      doc.text('Transactions', 20, 20);
      doc.autoTable({
        head: [['Username', 'Product', 'Quantity', 'Total Price', 'Date', 'Status']],
        body: transactions.map((transaction) => [
          transaction.buyer.username,
          transaction.products.map(p => p.product.name).join(', '),
          transaction.products.map(p => p.quantity).join(', '),
          transaction.totalPrice,
          transaction.date,
          transaction.status,
        ]),
      });
      doc.save('transactions.pdf');
      toast.success('Receipt downloaded successfully');
    }
  };

  const handleExportTransactions = async (transactionId) => {
    console.log('Exporting transactions for:', transactionId);
    const count = await checkTransactionCount(transactionId);
    if (count < 0) {
      toast.error('Error fetching transaction count');
    } else if (count > 0) {
      toast.error('Duplicate transaction, cannot export');
    } else {
      await incrementTransactionCount(transactionId);
      incrementNotificationCount();
      const csvContent = transactions.map((transaction) =>
        `${transaction.buyer.username},${transaction.products.map(p => p.product.name).join(';')},${transaction.products.map(p => p.quantity).join(';')},${transaction.totalPrice},${transaction.date},${transaction.status}`
      ).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'transactions.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Transactions exported successfully');
    }
  };

  const incrementNotificationCount = () => {
    console.log('Incrementing notification count');
    const currentCount = parseInt(localStorage.getItem('notificationCount'), 10) || 0;
    const newCount = currentCount + 1;
    localStorage.setItem('notificationCount', newCount);
       console.log('Notification count incremented to', newCount);
  };

  const totalTransactions = transactions.length;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
  const currentTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto mt-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <button
        onClick={() => setModalIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Transaction
      </button>
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Username</th>
                  <th className="py-2 px-4 border-b">Products</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Total Price</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="py-2 px-4 border-b">{transaction.buyer.username}</td>
                    <td className="py-2 px-4 border-b">
                      {transaction.products.map((p) => p.product.name).join(', ')}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction.products.map((p) => p.quantity).join(', ')}
                    </td>
                    <td className="py-2 px-4 border-b">{transaction.totalPrice}</td>
                    <td className="py-2 px-4 border-b">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{getStatusIcon(transaction.status)}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleDownloadReceipt(transaction._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleExportTransactions(transaction._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Export
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-3 py-1 border rounded ${
                  currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Add Transaction"
      >
        <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
        <div className="mb-4">
          <label className="block text-gray-700">TIN Number</label>
          <input
            type="text"
            name="tinNumber"
            value={newTransaction.tinNumber}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={newTransaction.username}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Products</label>
          <div className="flex mb-2">
            <select
              name="productId"
              value={currentProduct.productId}
              onChange={handleProductChange}
              className="flex-1 border px-3 py-2 rounded mr-2"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="quantity"
              value={currentProduct.quantity}
              onChange={handleProductChange}
              className="w-20 border px-3 py-2 rounded"
            />
            <button
              onClick={handleAddProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
              Add
            </button>
          </div>
          <div>
            {newTransaction.products.map((product, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{products.find((p) => p._id === product.productId)?.name} - {product.quantity}</span>
                <button
                  onClick={() => handleRemoveProduct(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddTransaction}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Transaction
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Transactions;

