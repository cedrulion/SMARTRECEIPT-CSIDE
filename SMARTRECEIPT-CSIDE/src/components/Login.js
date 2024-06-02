import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Frame from '../Assets/Frame.png';
import logo from '../Assets/Logo.png';

const Login = () => {
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const navigate = useNavigate();

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
  
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/user/login', values);

        if (response.status === 200) {
          const { token } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('loggedInUser', JSON.stringify(response.data.loggedInUser)); // Store loggedInUser
          toast.success('Login successful!');
          console.log(token);

          // Log loggedInUser
          const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
          console.log('loggedInUser:', loggedInUser);

          navigate('/dashboard/dashboardd');
        } else {
          const data = response.data;
          toast.error(data.message || 'Login failed');
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
    <div className="font-roboto flex items-center justify-center ">
      <div className="flex justify-between gap-16">
        <div className="flex items-center justify-center mb-8 ">
          <img src={Frame} alt="logo" className="w-full h-auto object-cover rounded-lg shadow-md" />
        </div>
        <div className="bg-white rounded-lg shadow-md m-9 p-6 border border-purple-300">
          <h2 className="text-2xl font-bold text-center mb-4">Welcome back</h2>
          <p className="text-center text-gray-600 mb-8">Enter details to log in and continue</p>
          <form onSubmit={formik.handleSubmit}>
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
                name="email"
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 pt-4 pb-2 border ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
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
                name="password"
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                className={`w-full px-4 pt-4 pb-2 border ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <a href="#" className="text-sm text-purple-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className={`w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700 ${
                formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-600 hover:underline">
              Sign up
            </Link>
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

export default Login;
