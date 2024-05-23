import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Frame from '../Assets/Frame.png';

const Login = () => {
  const navigate = useNavigate();
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
        
          localStorage.setItem('token', token );
          toast.success('Login successful!');
          console.log(token);
          navigate('/dashboard');
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
    <div className="flex items-center justify-center text-sm">
      <div className="flex justify-between gap-16">
        <div className="flex items-center justify-center mb-8 ">
        <img src={Frame} alt="logo" className="w-full h-auto object-cover rounded-lg shadow-md" />
        </div>
        <div className="bg-white rounded-lg shadow-md m-9 p-6 border border-purple-300">
          <h2 className="text-2xl font-bold text-center mb-4">Welcome back</h2>
          <p className="text-center text-gray-600 mb-8">Enter details to log in and continue</p>
          <form onSubmit={formik.handleSubmit}>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border ${
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
            <a href="#" className="text-purple-600 hover:underline">
              Sign up
            </a>
          </p>
          <div className="mt-6">
            <button className="w-full bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md flex items-center justify-center mb-2">
              <img src="path/to/rra_logo.png" alt="RRA Logo" className="w-5 h-5 mr-2" />
              Continue with RRA Credentials
            </button>
            <button className="w-full bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md flex items-center justify-center">
              <img src="path/to/microsoft_logo.png" alt="Microsoft Logo" className="w-5 h-5 mr-2" />
              Continue with Microsoft Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
