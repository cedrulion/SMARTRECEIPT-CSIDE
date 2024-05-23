import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Message = () => {
  const initialValues = {
    businessName: '',
    businessEmail: '',
    phoneNumber: '',
    message: '',
  };

  const validationSchema = Yup.object().shape({
    businessName: Yup.string().required('Business name is required'),
    businessEmail: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    message: Yup.string().required('Message is required'),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/product/save', values);

      if (response.status === 200) {
        toast.success('Product details added successfully!');
        resetForm();
      } else {
        toast.error('Failed to add product details');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-gradient-to-r from-purple-100 to-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-4 text-purple-700  ">Add Product Details</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="businessName">Business name</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formik.values.businessName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {formik.touched.businessName && formik.errors.businessName ? (
              <div className="text-red-500">{formik.errors.businessName}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="businessEmail">Business email</label>
            <input
              type="email"
              id="businessEmail"
              name="businessEmail"
              value={formik.values.businessEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {formik.touched.businessEmail && formik.errors.businessEmail ? (
              <div className="text-red-500">{formik.errors.businessEmail}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phoneNumber">Phone number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
              <div className="text-red-500">{formik.errors.phoneNumber}</div>
            ) : null}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Type message here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 h-24"
            ></textarea>
            {formik.touched.message && formik.errors.message ? (
              <div className="text-red-500">{formik.errors.message}</div>
            ) : null}
          </div>
          <div className="flex justify-between items-center">
            <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700">
              Send <span className="ml-2">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Message;
