// src/components/Product.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [business, setBusiness] = useState()
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    nID: '',
    email: '',
    role: 'EMPLOYEE',
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteModalOpen = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem('token');
  const fetchUsers = async () => {
    const busInfo = JSON.parse(localStorage.getItem("user")).business
    try {
      const response = await axios.post('http://localhost:5000/api/user/get/employees', { business: busInfo }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      if (response.data.dataPresent === true) {
        setUsers(response.data.users);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/user/delete/${id}`,{ business }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      toast.success('user deleted successfully');
      setIsDeleteModalOpen(false)
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUsers) => ({
      ...prevUsers,
      [name]: value,
    }));
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/user/add/employee', { ...newUser, business: business }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      toast.success('Product added successfully');
      setIsAddModalOpen(false);
      setNewUser({
        name: '',
        email: '',
        nID: '',
        role: 'EMPLOYEE',
      });
      fetchUsers();
    } catch (error) {
      toast.error('Error adding users');
    }
  };

  const handleUpdateUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/user/update/employee', { ...currentUser }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      toast.success('user updated successfully');
      setIsUpdateModalOpen(false);
      setCurrentUser(null);
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user');
    }
  };

  const handleModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdateModalOpen = (user) => {
    setCurrentUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    fetchUsers();
    const busInfo = JSON.parse(localStorage.getItem("user")).business
    setBusiness(busInfo)
  }, []);

  return (
    <div className="container mx-auto p-4" style={{ fontFamily: 'inter' }}>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold"></h1>
        <button onClick={handleModalOpen} className="text-white block w-1/2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900">+ Add Product</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">
                  user name
                </th>
                <th scope="col" className="px-6 py-3">
                  email
                </th>
                <th scope="col" className="px-6 py-3">
                  nID
                </th>
                <th scope="col" className="px-6 py-3">
                  role
                </th>
                <th scope="col" className="px-6 py-3">
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.nID}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-5" style={{ cursor: "pointer" }} onClick={() => handleUpdateModalOpen(user)}>Edit</a>
                    <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-5" style={{ cursor: "pointer" }} onClick={() => handleDeleteModalOpen(user)}>Delete</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="bg-blue-600 text-white p-4 rounded-t-md mb-4">
              <h2 className="text-xl font-bold">Add New user</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block">Name</label>
                <input
                  type="text"
                  name="username"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block">Email</label>
                <input
                  type="text"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block">National Identity</label>
                <input
                  type="text"
                  name="nID"
                  value={newUser.nID}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add user
              </button>
            </div>
          </div>
        </div>
      )}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="bg-blue-600 text-white p-4 rounded-t-md mb-4">
              <h2 className="text-xl font-bold">Update user</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentUser.username}
                  onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block">Email</label>
                <input
                  type="text"
                  name="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block">National ID</label>
                <input
                  type="number"
                  name="nID"
                  value={currentUser.nID}
                  onChange={(e) => setCurrentUser({ ...currentUser, nID: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleUpdateModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-5">Delete user</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center mt-3 space-x-3">
                <button
                  onClick={handleDeleteModalClose}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteUser(userToDelete._id)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
