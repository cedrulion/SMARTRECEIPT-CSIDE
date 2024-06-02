import React from 'react';
import { MdError } from 'react-icons/md';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Fail = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard/payment');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <button 
        onClick={handleBack} 
        className="absolute top-4 left-4 text-gray-500 hover:text-gray-700" 
        aria-label="Go back"
      >
        <FaArrowLeft className="text-3xl" />
      </button>
      <div className="bg-red-100 p-8 rounded-full flex items-center justify-center mt-20">
        <MdError className="text-red-500 text-6xl" />
      </div>
      <p className="mt-6 text-2xl text-gray-900">Payment Failed</p>
    </div>
  );
};

export default Fail;
