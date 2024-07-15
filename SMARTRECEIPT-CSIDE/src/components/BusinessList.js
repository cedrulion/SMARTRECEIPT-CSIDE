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
    setIsEditing(false)
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
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Business Name</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Map Location</th>
              <th scope="col" className="px-6 py-3">TIN Number</th>
              <th scope="col" className="px-6 py-3">Basic Information</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business) => (
              <tr key={business._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{business.businessName}</td>
                <td className="px-6 py-4">{business.businessCategory}</td>
                <td className="px-6 py-4">{business.businessLocation}</td>
                <td className="px-6 py-4">{business.businessTINNumber}</td>
                <td className="px-6 py-4">{business.basicInformation}</td>
                <td className="px-6 py-4">
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
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-2xl w-full">
            <div className="p-6 bg-gray-100" style={{ overflowY: 'scroll' }}>
              <div className="flex justify-between items-center mb-4">
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
                  <span>Business Information</span>
                </div>
                <button onClick={() => setShowModal(false)} className="text-2xl">&times;</button>
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="businessName"
                        value={formValues.businessName}
                        onChange={handleChange}
                        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-100 gray-400 "
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-100 rounded-md p-2">{formValues.businessName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="businessCategory"
                        value={formValues.businessCategory}
                        onChange={handleChange}
                        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-100 gray-400 "
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-100 rounded-md p-2">{formValues.businessCategory}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TIN Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="businessTINNumber"
                        value={formValues.businessTINNumber}
                        onChange={handleChange}
                        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-100 gray-400 "
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-100 rounded-md p-2">{formValues.businessTINNumber}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Basic Information</label>
                    {isEditing ? (
                      <textarea
                        name="basicInformation"
                        value={formValues.basicInformation}
                        onChange={handleChange}
                        rows="4"
                        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-100 gray-400 "
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-100 rounded-md p-2 whitespace-pre-wrap">{formValues.basicInformation}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Map Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="mapLocation"
                        value={formValues.mapLocation}
                        onChange={handleChange}
                        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-100 gray-400 "
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-100 rounded-md p-2">{formValues.mapLocation}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                {isEditing ? (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    onClick={handleUpdate}
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Information
                  </button>
                )}
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
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
