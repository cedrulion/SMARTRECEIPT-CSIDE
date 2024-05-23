import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUpload } from 'react-icons/fa';

const Information = () => {
  const initialValues = {
    businessProfile: '',
    basicInformation: '',
    businessRole: '',
    businessCategory: '',
    businessName: '',
    mapLocation: '',
    tinNumber: '',
  };

  const validationSchema = Yup.object().shape({
    businessProfile: Yup.string().required('Business profile is required'),
    basicInformation: Yup.string().required('Business basic information is required'),
    businessRole: Yup.string().required('Business role is required'),
    businessCategory: Yup.string().required('Business category is required'),
    businessName: Yup.string().required('Business name is required'),
    mapLocation: Yup.string().required('Business map location is required'),
    tinNumber: Yup.string().required('Business TIN number is required'),
  });

  const onSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/business/add', values);

      if (response.status === 200) {
        toast.success('Business information added successfully!');
      } else {
        toast.error('Failed to add business information');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Server error');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Business Information</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <FaUpload className="text-xl mr-2" />
          <span>Upload Business profile</span>
          <span className="ml-auto text-sm text-gray-500">Ensure images uploaded are not greater than 2mb each.</span>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-700">Business basic Information</label>
              <textarea
                name="basicInformation"
                value={formik.values.basicInformation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg p-2 mt-1 ${formik.touched.basicInformation && formik.errors.basicInformation ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Product description comes here for you to add details to stimulate purchase."
                rows="4"
              />
              {formik.touched.basicInformation && formik.errors.basicInformation ? (
                <div className="text-red-500">{formik.errors.basicInformation}</div>
              ) : null}
            </div>
            <div>
              <label className="block text-gray-700">Business Role</label>
              <input
                type="text"
                name="businessRole"
                value={formik.values.businessRole}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg p-2 mt-1 ${formik.touched.businessRole && formik.errors.businessRole ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="0813 614 3905"
              />
              {formik.touched.businessRole && formik.errors.businessRole ? (
                <div className="text-red-500">{formik.errors.businessRole}</div>
              ) : null}
            </div>
            <div>
              <label className="block text-gray-700">Business Category</label>
              <input
                type="text"
                name="businessCategory"
                value={formik.values.businessCategory}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg p-2 mt-1 ${formik.touched.businessCategory && formik.errors.businessCategory ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter business category"
              />
              {formik.touched.businessCategory && formik.errors.businessCategory ? (
                <div className="text-red-500">{formik.errors.businessCategory}</div>
              ) : null}
            </div>
            <div>
              <label className="block text-gray-700">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formik.values.businessName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg p-2 mt-1 ${formik.touched.businessName && formik.errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter business name"
              />
              {formik.touched.businessName && formik.errors.businessName ? (
                <div className="text-red-500">{formik.errors.businessName}</div>
              ) : null}
            </div>
            <div>
              <label className="block text-gray-700">Business Map Location</label>
              <input
                type="text"
                name="mapLocation"
                value={formik.values.mapLocation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg p-2 mt-1 ${formik.touched.mapLocation && formik.errors.mapLocation ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter business map location"
              />
              {formik.touched.mapLocation && formik.errors.mapLocation ? (
                <div className="text-red-500">{formik.errors.mapLocation}</div>
              ) : null}
            </div>
            <div>
              <label className="block text-gray-700">Business TIN Number</label>
              <input
                type="text"
                name="tinNumber"
                value={formik.values.tinNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg p-2 mt-1 ${formik.touched.tinNumber && formik.errors.tinNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter business TIN number"
              />
              {formik.touched.tinNumber && formik.errors.tinNumber ? (
                <div className="text-red-500">{formik.errors.tinNumber}</div>
              ) : null}
            </div>
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700 mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Information;

