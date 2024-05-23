// src/components/AddProductModal.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [productData, setProductData] = useState({
    name: '',
    productId: '',
    quantity: '',
    details: '',
    unitPrice: '',
  });

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/product/add', productData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      toast.success('Product added successfully');
      onProductAdded();
      onClose();
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="productId">Product ID</label>
            <input
              type="text"
              id="productId"
              name="productId"
              value={productData.productId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="details">Details</label>
            <textarea
              id="details"
              name="details"
              value={productData.details}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="unitPrice">Unit Price</label>
            <input
              type="number"
              id="unitPrice"
              name="unitPrice"
              value={productData.unitPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
