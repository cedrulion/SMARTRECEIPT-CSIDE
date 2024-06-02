import React, { useState } from 'react';
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

  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    let errors = {};

    if (!formValues.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = 'Invalid email address';
    }

    if (!formValues.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await axios.post('http://localhost:5000/api/user/login', formValues);

        if (response.status === 200) {
          const { token } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('loggedInUser', JSON.stringify(response.data.loggedInUser)); // Store loggedInUser
          toast.success('Login successful!');
          navigate('/dashboard/dashboardd');
        } else {
          const data = response.data;
          toast.error(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Server error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100" style={{ fontFamily: 'inter' }}>
      <div className="flex justify-between gap-16">
        <div className="flex items-center justify-center mb-8 ">
          <img src={Frame} alt="logo" className="w-full h-auto object-cover rounded-lg shadow-md" />
        </div>
        <div className="bg-white rounded-lg shadow-md m-9 p-6 border rounded-xl  border-purple-300">
          <h2 className="text-2xl font-bold text-center mb-4">Welcome back</h2>
          <p className="text-center text-gray-600 mb-8">Enter details to log in and continue</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6 relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                placeholder=" "
                className={`w-full px-4 pt-6 pb-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
              />
              <label
                className={`absolute left-4 top-2 text-gray-700 transition-all duration-200 ${formValues.email || isFocused.email ? 'text-xs -top-0.4 text-gray-500' : 'top-4'
                  }`}
                htmlFor="email"
              >
                Email
              </label>
              {formErrors.email && (
                <div className="text-red-500 text-sm mt-0">{formErrors.email}</div>
              )}
            </div>
            <div className="mb-6 relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                placeholder=" "
                className={`w-full px-4 pt-6 pb-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
              />
              <label
                className={`absolute left-4 top-2 text-gray-700 transition-all duration-200 ${formValues.password || isFocused.password ? 'text-xs -top-0.4 text-gray-500' : 'top-4'
                  }`}
                htmlFor="password"
              >
                Password
              </label>
              {formErrors.password && (
                <div className="text-red-500 text-sm mt-0">{formErrors.password}</div>
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
              className={`w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <p className="text-center mt-4">
            <span className='text-black font-medium'>Don't have an account?{' '}</span>
            <Link to="/signup" className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </p>
          <div className="mt-6">
            <button className="w-full bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md flex items-center justify-center mb-2">
              <img src={logo} alt="logo" className="h-6" />
              <Link to="/rra"><h2>Continue with RRA Credentials</h2></Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
