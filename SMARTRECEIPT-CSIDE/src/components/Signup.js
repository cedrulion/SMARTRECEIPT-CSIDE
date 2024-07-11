import React, { useState } from 'react';
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
    const [formValues, setFormValues] = useState({
        username: '',
        nID: '',
        email: '',
        password: '',
        role: selectedRole,
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
        setFormValues({ ...formValues, role: e.target.value });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleFocus = (field) => {
        setIsFocused({ ...isFocused, [field]: true });
    };

    const handleBlur = (field) => {
        setIsFocused({ ...isFocused, [field]: false });
    };

    const validate = () => {
        let errors = {};

        if (!formValues.username) {
            errors.username = 'Username is required';
        }

        if (!formValues.nID) {
            errors.nID = 'National ID is required';
        }

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
                const response = await axios.post('http://localhost:5000/api/user/signup', formValues);
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
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-sm" style={{ fontFamily: 'inter' }}>
            <ToastContainer />
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center justify-center mb-8">
                    <img src={Frame} alt="logo" className="w-full h-auto object-cover rounded-lg shadow-md" />
                </div>
                <div className='bg-white rounded-xl shadow-md m-3 p-6 border border-purple-300 mx-4'>
                    <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
                    <p className="text-center text-gray-600 mb-3">Create your account and start now</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2 relative">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formValues.username}
                                onChange={handleChange}
                                onFocus={() => handleFocus('username')}
                                onBlur={() => handleBlur('username')}
                                placeholder=" "
                                className={`w-full px-4 pt-6 pb-2 border ${formErrors.username ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                            />
                            <label
                                className={`absolute left-4 top-2 text-gray-700 transition-all duration-200 ${formValues.username || isFocused.username ? 'text-xs -top-0.4 text-gray-500' : 'top-4'
                                    }`}
                                htmlFor="username"
                            >
                                User name
                            </label>
                            {formErrors.username && (
                                <div className="text-red-500 text-sm mt-0">{formErrors.username}</div>
                            )}
                        </div>
                        <div className="mb-2 relative">
                            <input
                                type="text"
                                id="nID"
                                name="nID"
                                value={formValues.nID}
                                onChange={handleChange}
                                onFocus={() => handleFocus('nID')}
                                onBlur={() => handleBlur('nID')}
                                placeholder=" "
                                className={`w-full px-4 pt-6 pb-2 border ${formErrors.nID ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                            />
                            <label
                                className={`absolute left-4 top-2 text-gray-700 transition-all duration-200 ${formValues.nID || isFocused.nID ? 'text-xs -top-0.4 text-gray-500' : 'top-4'
                                    }`}
                                htmlFor="nID"
                            >
                                National ID
                            </label>
                            {formErrors.nID && (
                                <div className="text-red-500 text-sm mt-0">{formErrors.nID}</div>
                            )}
                        </div>
                        <div className="mb-2 relative">
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
                        <div className="mb-2 relative">
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
                        {/* <div className="mb-2">
                            <label htmlFor='role' className='block text-gray-700 mb-2'>Select Role</label>
                            <select
                                id='role'
                                name='role'
                                value={selectedRole}
                                onChange={handleRoleChange}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600'
                            >
                                <option value='BUSINESS'>Business</option>
                                <option value='EMPLOYEE'>Employee</option>
                            </select>
                        </div> */}
                        <div className="mb-2">
                            <button
                                type="submit"
                                className={`w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating account...' : 'Create account'}
                            </button>
                        </div>
                    </form>
                    <p className="text-center mt-4">
                        <span className='text-black font-medium'>Already have an account?{' '}</span>
                        <Link to="/signup" className="text-purple-600 hover:underline">
                            Sign in
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

export default Signup;