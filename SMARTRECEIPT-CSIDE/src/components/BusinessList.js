import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    basicInformation: '',
    businessCategory: '',
    businessName: '',
    mapLocation: '',
    businessTINNumber: '',
  });

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/business/getall', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch business information');
    }
  };

  const fetchBusinessById = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/api/business/getid/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      setSelectedBusiness(response.data);
      setFormValues({
        basicInformation: response.data.basicInformation,
        businessCategory: response.data.businessCategory,
        businessName: response.data.businessName,
        mapLocation: response.data.businessLocation,
        businessTINNumber: response.data.businessTINNumber,
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch business information');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:5000/api/business/${selectedBusiness._id}`, formValues, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      toast.success('Business information updated successfully');
      fetchBusinesses(); // Refresh the list
      setShowModal(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update business information');
    }
  };

  return (
    <div className="container mx-auto p-4" style={{ fontFamily: 'inter' }}>
      <h2 className="text-2xl font-semibold my-4">Business List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Business Name</th>
              <th className="px-4 py-2 border-b">Category</th>
              <th className="px-4 py-2 border-b">Map Location</th>
              <th className="px-4 py-2 border-b">TIN Number</th>
              <th className="px-4 py-2 border-b">Basic Information</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business) => (
              <tr key={business._id}>
                <td className="px-4 py-2 border-b">{business.businessName}</td>
                <td className="px-4 py-2 border-b">{business.businessCategory}</td>
                <td className="px-4 py-2 border-b">{business.businessLocation}</td>
                <td className="px-4 py-2 border-b">{business.businessTINNumber}</td>
                <td className="px-4 py-2 border-b">{business.basicInformation}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => fetchBusinessById(business._id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedBusiness && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Business Information</h2>
              <div className="mb-4">
                <label className="block text-gray-700">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formValues.businessName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Basic Information</label>
                <textarea
                  name="basicInformation"
                  value={formValues.basicInformation}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded-lg p-2 mt-1"
                  rows="4"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  name="businessCategory"
                  value={formValues.businessCategory}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Map Location</label>
                <input
                  type="text"
                  name="mapLocation"
                  value={formValues.mapLocation}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">TIN Number</label>
                <input
                  type="text"
                  name="businessTINNumber"
                  value={formValues.businessTINNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div className="flex justify-end">
                {isEditing ? (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessList;
