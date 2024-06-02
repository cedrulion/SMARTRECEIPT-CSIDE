// src/components/Product.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    productId: '',
    quantity: 0,
    details: '',
    unitPrice: 0,
  });
  const [currentProduct, setCurrentProduct] = useState(null);

  const token = localStorage.getItem('token');

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

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/product/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      await axios.post('http://localhost:5000/api/product/add', newProduct, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      toast.success('Product added successfully');
      setIsAddModalOpen(false);
      setNewProduct({
        name: '',
        productId: '',
        quantity: 0,
        details: '',
        unitPrice: 0,
      });
      fetchProducts();
    } catch (error) {
      toast.error('Error adding product');
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.post('http://localhost:5000/api/product/update', { ...currentProduct }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      toast.success('Product updated successfully');
      setIsUpdateModalOpen(false);
      setCurrentProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error('Error updating product');
    }
  };

  const handleModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdateModalOpen = (product) => {
    setCurrentProduct(product);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    setCurrentProduct(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold"></h1>
        <button onClick={handleModalOpen} className="btn btn-primary font-bold border-t">+ Add Product</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name of the product</th>
              <th className="py-2">Product ID</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Details</th>
              <th className="py-2">Unit Price</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="text-center border-t">
                <td className="py-2">{product.name}</td>
                <td className="py-2">{product.productId}</td>
                <td className="py-2">{product.quantity}</td>
                <td className="py-2">{product.details}</td>
                <td className="py-2">{product.unitPrice}</td>
                <td className="py-2">
                  <button onClick={() => deleteProduct(product._id)} className="btn btn-danger bg-red-300 rounded px-2 py-2">Delete</button>
                  <button onClick={() => handleUpdateModalOpen(product._id)} className="btn btn-warning ml-2 bg-blue-300 rounded px-2 py-2">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div>
              <label className="block">Name</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block">Product ID</label>
              <input
                type="text"
                name="productId"
                value={newProduct.productId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block">Details</label>
              <input
                type="text"
                name="details"
                value={newProduct.details}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block">Unit Price</label>
              <input
                type="number"
                name="unitPrice"
                value={newProduct.unitPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div>
              <label className="block">Name</label>
              <input
                type="text"
                name="name"
                value={currentProduct.name}
                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block">Product ID</label>
              <input
                type="text"
                name="productId"
                value={currentProduct.productId}
                onChange={(e) => setCurrentProduct({ ...currentProduct, productId: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={currentProduct.quantity}
                onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
           </div>
           <div>
           <label className="block">Details</label>
                <input
                  type="text"
                  name="details"
                  value={currentProduct.details}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, details: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block">Unit Price</label>
                <input
                  type="number"
                  name="unitPrice"
                  value={currentProduct.unitPrice}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, unitPrice: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={handleUpdateModalClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProduct}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Update Product
                </button>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Product;
