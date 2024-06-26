import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Information = () => {
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

  const validationSchema = Yup.object().shape({
    basicInformation: Yup.string().required('Business basic information is required'),
    businessCategory: Yup.string().required('Business category is required'),
    businessName: Yup.string().required('Business name is required'),
    businessLocation: Yup.string().required('Business map location is required'),
    businessTINNumber: Yup.string().required('Business TIN number is required'),
  });

  const onSubmit = async (values) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/business/add', values, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

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
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Business Information</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-700">Business Basic Information</label>
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
                name="businessLocation"
                value={formik.values.businessLocation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg p-2 mt-1 ${formik.touched.businessLocation && formik.errors.businessLocation ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter business map location"
              />
              {formik.touched.businessLocation && formik.errors.businessLocation ? (
                <div className="text-red-500">{formik.errors.businessLocation}</div>
              ) : null}
            </div>
            <div>
              <label className="block text-gray-700">Business TIN Number</label>
              <input
                type="text"
                name="businessTINNumber"
                value={formik.values.businessTINNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg p-2 mt-1 ${formik.touched.businessTINNumber && formik.errors.businessTINNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter business TIN number"
              />
              {formik.touched.businessTINNumber && formik.errors.businessTINNumber ? (
                <div className="text-red-500">{formik.errors.businessTINNumber}</div>
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
