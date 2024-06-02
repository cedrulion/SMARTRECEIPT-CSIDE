import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Frame from '../Assets/Frame.png';
import logo from '../Assets/Logo.png';

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState('BUSINESS');
  const [isFocused, setIsFocused] = useState({
    username: false,
    nID: false,
    email: false,
    password: false
  });

  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      nID: '',
      email: '',
      password: '',
      role: selectedRole,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .required('Required'),
      nID: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/user/signup', { ...values, role: selectedRole });
        if (response.status === 200) {
          toast.success('Signup successful!');
          navigate('/login');
        } else {
          toast.error(response.data.message || 'Signup failed');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Server error');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="font-roboto min-h-screen flex items-center justify-center bg-gray-100 text-sm">
      <ToastContainer />
      <div className="flex flex-col md:flex-row items-center justify-between gap-16">
        <div className="flex items-center justify-center mb-8">
          <img src={Frame} alt="logo" className="w-full h-auto object-cover rounded-lg shadow-md" />
        </div>
        <div className='bg-white rounded-lg shadow-md m-3 p-2 border border-purple-300'>
          <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-center text-gray-600 mb-3">Create your account and start now</p>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-2 relative">
              <label 
                className={`absolute left-4 top-2 text-gray-700 transition-all duration-200 ${formik.values.username || isFocused.username ? 'hidden' : 'block'}`} 
                htmlFor="username"
              >
                User name
              </label>
              <input
                type="text"
                id="username"
                onFocus={() => handleFocus('username')}
                onBlur={() => handleBlur('username')}
                className={`w-full px-4 pt-4 pb-2 border ${formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                {...formik.getFieldProps('username')}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
              ) : null}
            </div>
            <div className="mb-4 relative">
              <label 
                className={`absolute left-4 top-2 text-gray-700 transition-all duration-200 ${formik.values.nID || isFocused.nID ? 'hidden' : 'block'}`} 
                htmlFor="nID"
              >
                National ID
              </label>
              <input
                type="text"
                id="nID"
                onFocus={() => handleFocus('nID')}
                onBlur={() => handleBlur('nID')}
                className={`w-full px-4 pt-4 pb-2 border ${formik.touched.nID && formik.errors.nID ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                {...formik.getFieldProps('nID')}
              />
              {formik.touched.nID && formik.errors.nID ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.nID}</div>
              ) : null}
            </div>
            <div className="mb-4 relative">
              <label 
                className={`absolute left-4 top-2 text-gray-700 transition-all duration-200 ${formik.values.email || isFocused.email ? 'hidden' : 'block'}`} 
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 pt-4 pb-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="mb-4 relative">
              <label 
                className={`absolute left-4 top-2 text-gray-700 transition-all duration-200 ${formik.values.password || isFocused.password ? 'hidden' : 'block'}`} 
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                className={`w-full px-4 pt-4 pb-2 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="mb-4">
              <label htmlFor='role' className='block text-gray-700 mb-2'>Select Role</label>
              <select
                id='role'
                name='role'
                value={selectedRole}
                onChange={handleRoleChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600'
              >
                <option value='BUSINESS'>Business</option>
                <option value='RRA'>RRA</option>
              </select>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <Link to="#" className="text-sm text-purple-600 hover:underline">Forgot password?</Link>
            </div>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700"
            >
              {formik.isSubmitting ? 'Signing Up...' : 'Continue'}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Already have an account? <Link to="/login" className="text-purple-600 hover:underline">Sign In</Link>
          </p>
          <div className="mt-6">
            <button className="w-full bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md flex items-center justify-center mb-2">
              
          <img src={logo} alt="logo" className="h-6" />
        
          <Link to="/rra" ><h2> Continue with RRA Credentials </h2></Link>   
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

