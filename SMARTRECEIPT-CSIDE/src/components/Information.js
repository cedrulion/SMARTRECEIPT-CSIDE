import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation,useNavigate } from 'react-router-dom';
const Information = () => {
  const location = useLocation();
  const data = location.state;
  const navigate=useNavigate()
  const [initialValues, setInitialValues] = useState({
    basicInformation: '',
    businessCategory: '',
    businessName: '',
    businessLocation: '',
    businessTINNumber: '',
  });


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/business/add', { ...initialValues, user: data._id });
      console.log(response.status);
      if (response.status === 200) {
        toast.success('Business information added successfully!');
        navigate("/login")
      } else {
        toast.error('Failed to add business information');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Server error');
    }
  };

  return (
    <div style={{ backgroundColor: "#F3F4F6", height: "100vh" }}>
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-6">Create business profile</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-gray-700">Business Basic Information</label>
                <textarea
                  name="basicInformation"
                  value={initialValues.basicInformation}
                  onChange={(e) => setInitialValues({ ...initialValues, basicInformation: e.target.value })}
                  className={`w-full border rounded-lg p-2 mt-1 ${!initialValues.basicInformation ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Product description comes here for you to add details to stimulate purchase."
                  rows="4"
                />
                {!initialValues.basicInformation && <div className="text-red-500">Business basic information is required</div>}
              </div>

              <div>
                <label className="block text-gray-700">Business Category</label>
                <select
                  name="businessCategory"
                  value={initialValues.businessCategory}
                  onChange={(e) => setInitialValues({ ...initialValues, businessCategory: e.target.value })}
                  className={`w-full border rounded-lg p-2 mt-1 ${!initialValues.businessCategory ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="" label="Select business category" />
                  <option value="LARGE" label="Large" />
                  <option value="MEDIUM" label="Medium" />
                  <option value="SMALL" label="Small" />
                </select>
                {!initialValues.businessCategory && <div className="text-red-500">Business category is required</div>}
              </div>

              <div>
                <label className="block text-gray-700">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={initialValues.businessName}
                  onChange={(e) => setInitialValues({ ...initialValues, businessName: e.target.value })}
                  className={`w-full border rounded-lg p-2 mt-1 ${!initialValues.businessName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter business name"
                />
                {!initialValues.businessName && <div className="text-red-500">Business name is required</div>}
              </div>

              <div>
                <label className="block text-gray-700">Business Location</label>
                <input
                  type="text"
                  name="businessLocation"
                  value={initialValues.businessLocation}
                  onChange={(e) => setInitialValues({ ...initialValues, businessLocation: e.target.value })}
                  className={`w-full border rounded-lg p-2 mt-1 ${!initialValues.businessLocation ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter business map location"
                />
                {!initialValues.businessLocation && <div className="text-red-500">Business map location is required</div>}
              </div>

              <div>
                <label className="block text-gray-700">Business TIN Number</label>
                <input
                  type="text"
                  name="businessTINNumber"
                  value={initialValues.businessTINNumber}
                  onChange={(e) => setInitialValues({ ...initialValues, businessTINNumber: e.target.value })}
                  className={`w-full border rounded-lg p-2 mt-1 ${!initialValues.businessTINNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter business TIN number"
                />
                {!initialValues.businessTINNumber && <div className="text-red-500">Business TIN number is required</div>}
              </div>
            </div>
            <button
              type="submit"
              onClick={onSubmit}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700 mt-4"
            >
              Submit
            </button>
          </form>
        </div>
        <ToastContainer/>
      </div>
    </div>
  );
};

export default Information;
