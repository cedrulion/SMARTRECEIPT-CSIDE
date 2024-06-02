import React from 'react';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard/payment');
  };

  return (
    <div className=" min-h-screen bg-green-50">
      <button 
        onClick={handleBack} 
        className="absolute top-15 mt-4 ml-4 text-gray-500 hover:text-gray-700"
      >
        <FaArrowLeft className="text-3xl" />
      </button>
     <div className="flex flex-col items-center justify-center ">
      <div className="bg-green-100 p-8 rounded-full flex items-center justify-center mt-20">
        <FaCheckCircle className="text-green-500 text-6xl" />
      </div>
<p className="mt-6 text-2xl text-gray-900">Payment Successful</p>
</div>
      
    </div>
  );
};

export default Success;
