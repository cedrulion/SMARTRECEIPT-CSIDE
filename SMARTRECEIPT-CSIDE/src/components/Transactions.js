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
    width: '80%',  // Adjust width
    maxHeight: '90vh',  // Adjust max height
    overflowY: 'auto',  // Enable vertical scrolling
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
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      toast.error(`Failed to fetch transactions: ${error.response.data.message}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request data:', error.request);
      toast.error('No response received from the server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      toast.error(`Error: ${error.message}`);
    }
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

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    doc.text('Transactions', 20, 20);
    doc.autoTable({
      head: [['Username', 'Product', 'Quantity', 'Total Price', 'Date', 'Status']],
      body: transactions.map((transaction) => [
        transaction.buyer.username,
        transaction.products.map(p => p.product.name).join(', '),
        transaction.products.map(p => p.quantity).join(', '),
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
        transaction.products.map(p => p.product.name).join(', '),
        transaction.products.map(p => p.quantity).join(', '),
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
    <div className="flex-1 p-6 bg-gray-100" style={{ fontFamily: 'inter' }}>
      <ToastContainer />
      <h1 className="text-2xl font-bold">Transactions</h1>
      <button onClick={() => setModalIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Add Transaction</button>
      <button onClick={handleDownloadReceipt} className="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-2">Download Receipt</button>
      <button onClick={handleExportReceipt} className="bg-purple-500 text-white px-4 py-2 rounded mt-4 ml-2">Export Receipt</button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles} >
        <div className="flex justify-between items-center mb-4 ">
          <h2 className="text-lg font-semibold">Add Transaction</h2>
          <button onClick={() => setModalIsOpen(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex">
          <div className="w-1/2 pr-4">
            <div className="my-4">
              <label htmlFor="tinNumber">TIN Number</label>
              <input type="text" id="tinNumber" name="tinNumber" value={newTransaction.tinNumber} onChange={handleInputChange} className="block w-full px-4 py-2 mt-2 text-sm text-gray-700 placeholder-gray-400 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter TIN Number" />
            </div>
            <div className="my-4">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" value={newTransaction.username} onChange={handleInputChange} className="block w-full px-4 py-2 mt-2 text-sm text-gray-700 placeholder-gray-400 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter Username" />
            </div>
            <div className="my-4">
              <label htmlFor="productId">Product</label>
              <select id="productId" name="productId" value={currentProduct.productId} onChange={handleProductChange} className="block w-full px-4 py-2 mt-2 text-sm text-gray-700 placeholder-gray-400 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div className="my-4">
              <label htmlFor="quantity">Quantity</label>
              <input type="number" id="quantity" name="quantity" value={currentProduct.quantity} onChange={handleProductChange} className="block w-full px-4 py-2 mt-2 text-sm text-gray-700 placeholder-gray-400 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter Quantity" />
            </div>
            <button onClick={handleAddProduct} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Add Product</button>
          </div>
          <div className="w-1/2 pl-4">
            <h3 className="text-lg font-semibold mb-4">Selected Products</h3>
            {newTransaction.products.length === 0 ? (
              <p>No products added yet.</p>
            ) : (
              <ul>
                {newTransaction.products.map((product, index) => {
                  const productInfo = products.find((p) => p._id === product.productId);
                  return (
                    <li key={index} className="flex justify-between items-center py-2">
                      <span>{productInfo ? productInfo.name : 'Unknown Product'}</span>
                      <span>Quantity: {product.quantity}</span>
                      <button onClick={() => handleRemoveProduct(index)} className="text-red-500 hover:text-red-700 focus:outline-none">
                        <FaTrash />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <button onClick={handleAddTransaction} className="bg-green-500 text-white px-4 py-2 rounded mt-4">Submit Transaction</button>
      </Modal>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="min-w-full bg-white mt-4">
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
                  <td className="border px-4 py-2">{transaction.buyer.username}</td>
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
                  <td className="border px-4 py-2">{transaction.totalPrice}</td>
                  <td className="border px-4 py-2">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{getStatusIcon(transaction.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-blue-500 text-white px-4 py-2 rounded">
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button onClick={handleNextPage} disabled={currentPage === Math.ceil(transactions.length / transactionsPerPage)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Transactions;
