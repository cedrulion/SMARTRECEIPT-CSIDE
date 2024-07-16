import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaTrash } from 'react-icons/fa';

const Etransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    tinNumber: '',
    username: '',
    products: [],
  });
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
  const [currentProduct, setCurrentProduct] = useState({ productId: '', quantity: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const token = localStorage.getItem('token');

  const fetchTransactions = async () => {
    const business = JSON.parse(localStorage.getItem('user')).business
    try {
      const response = await axios.post('http://localhost:5000/api/transaction/get', { business }, {
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
    const business = JSON.parse(localStorage.getItem('user')).business
    try {
      const response = await axios.post('http://localhost:5000/api/transaction/add', { ...newTransaction, business }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      setNewTransaction({
        tinNumber: '',
        username: '',
        products: [],
      });
      if (response.data.status === "200") {
        toast.success('Transaction added successfully');
        setModalIsOpen(false);
        fetchTransactions();
      }
      else {
        if (response.data.status === "600") {
          toast.warning(`Transaction ${response.data.message}`,);
        }
      }
    } catch (error) {
      toast.error('Error adding transaction');
    }
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
      fetchTransactions()
    }
  };

  const requestDuplicateCopy = async (transactionDetails) => {
    const business = JSON.parse(localStorage.getItem('user')).business
    const transaction = transactionDetails._id
    try {
      const response = await axios.post(`http://localhost:5000/api/notification/send`, { business, transaction }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      toast.success('Request sent succesfully');
    }
    catch (error) {
      console.error('Failed to get transaction count', error);
      toast.error('Failed to send request');
    }
  }

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
        className="text-white block w-1/3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900 mb-2 mx-3"
      >
        + Add Transaction
      </button>
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
                {currentTransactions.map((transaction) => (
                  <tr key={transaction._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{transaction.buyer.username}</td>
                    <td className="px-6 py-4">{transaction.totalPrice}</td>
                    <td className="px-6 py-4">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{getStatusIcon(transaction.status)}</td>
                    <td className="px-6 py-4">
                      <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-5" style={{ cursor: "pointer" }} onClick={() => handleDownloadReceipt(transaction._id)}>Download receipt</a>

                      <button
                        onClick={() => handleOpenDetailModal(transaction)}
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Detailed description
                      </button>
                      <button
                        disabled={transaction.count === 0}
                        onClick={() => requestDuplicateCopy(transaction)}
                        className={`px-4 py-2 rounded ${transaction.count === 0 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'
                          }`}
                      >
                        Request Duplicate Copy
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
                className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
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
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center bg-blue-100 p-4 rounded-t-lg">
            <h2 className="text-xl font-bold text-blue-800">Add Transaction</h2>
            <button
              onClick={() => setModalIsOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="mb-0">
              <label className="block text-gray-700 mb-0">TIN Number</label>
              <input
                type="text"
                name="tinNumber"
                value={newTransaction.tinNumber}
                onChange={handleInputChange}
                className="w-full border px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-0">
              <label className="block text-gray-700 mb-0">Customer name</label>
              <input
                type="text"
                name="username"
                value={newTransaction.username}
                onChange={handleInputChange}
                className="w-full border px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Products</label>
              <div className="space-y-2">
                <select
                  name="productId"
                  value={currentProduct.productId}
                  onChange={handleProductChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} - ID: {product.productId}
                    </option>
                  ))}
                </select>
                <div className="flex items-center w-full">
                  <label htmlFor="search" className="sr-only">Add product</label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3V3zm6 6l6 6m0-6l-6 6" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      name='quantity'
                      value={currentProduct.quantity}
                      onChange={handleProductChange}
                      id="quantity"
                      className="block w-full p-3 ps-10 pe-20 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Quantity"
                      required
                    />
                    <button
                      type="button"
                      className="text-white absolute end-2.5 top-1/2 transform -translate-y-1/2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                      onClick={handleAddProduct}
                    >
                      Add product
                    </button>
                  </div>
                </div>
              </div>
              <div className='mt-2'>
                {newTransaction.products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between mb-2 bg-gray-100 p-3 rounded-lg shadow-sm hover:bg-gray-200 transition duration-150 ease-in-out">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-800">{products.find((p) => p._id === product.productId)?.name}</span>
                      <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
                        <span className="text-xs font-semibold text-blue-800 mr-1">Qty:</span>
                        <span className="text-sm font-bold text-blue-900">{product.quantity}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1 transition duration-150 ease-in-out"
                      aria-label="Remove product"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddTransaction}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Generate
              </button>
              <button
                onClick={() => setModalIsOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded ml-2 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
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

export default Etransactions;

