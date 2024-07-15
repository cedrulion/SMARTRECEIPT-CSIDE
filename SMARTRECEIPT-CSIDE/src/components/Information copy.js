import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

const InformationDetails = () => {
  const location = useLocation();
  const data = location.state;
  const [initialValues, setInitialValues] = useState({
    basicInformation: '',
    businessCategory: '',
    businessName: '',
    businessLocation: '',
    businessTINNumber: '',
  });

  useEffect(() => {
    const fetchBusinessInformation = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/business/info', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        if (response.status === 200) {
          setInitialValues({
            basicInformation: response.data.basicInformation,
            businessCategory: response.data.businessCategory,
            businessName: response.data.businessName,
            businessLocation: response.data.businessLocation,
            businessTINNumber: response.data.businessTINNumber,
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Server error');
      }
    };

    fetchBusinessInformation();
  }, []);

  return (
    <div style={{ backgroundColor: "#F3F4F6", height: "100vh" }}>
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-6">Business Profile</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Business Basic Information</label>
              <p className="w-full border rounded-lg p-2 mt-1 border-gray-300 bg-gray-100">
                {initialValues.basicInformation}
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Business Category</label>
              <p className="w-full border rounded-lg p-2 mt-1 border-gray-300 bg-gray-100">
                {initialValues.businessCategory}
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Business Name</label>
              <p className="w-full border rounded-lg p-2 mt-1 border-gray-300 bg-gray-100">
                {initialValues.businessName}
              </p>
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold">Business Location</label>
              <p className="w-full border rounded-lg p-2 mt-1 border-gray-300 bg-gray-100">
                {initialValues.businessLocation}
              </p>
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold">Business TIN Number</label>
              <p className="w-full border rounded-lg p-2 mt-1 border-gray-300 bg-gray-100">
                {initialValues.businessTINNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationDetails;
