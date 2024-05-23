import React from 'react';
import { FaArrowUp, FaArrowDown, FaCheckCircle, FaSync, FaTimesCircle } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register the required components
Chart.register(...registerables);

const Dashboard = () => {
  // Data for the chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Statistics',
        data: [120, 190, 30, 50, 200, 300, 250, 400, 320, 280, 290, 340],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // Options for the chart
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-semibold">$100,000,000.00</div>
          <div className="text-gray-500">Total Balance</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-semibold">$1,000,000.00</div>
          <div className="text-gray-500">Total Income</div>
          <div className="text-green-500 flex items-center">
            <FaArrowUp className="mr-1" /> 10% from last month
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-semibold">$500,000.00</div>
          <div className="text-gray-500">Total Expenses</div>
          <div className="text-red-500 flex items-center">
            <FaArrowDown className="mr-1" /> 5% from last month
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        <Line data={data} options={options} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Transactions</h3>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-2">Name of the customer</th>
              <th className="pb-2">Transaction</th>
              <th className="pb-2">Payment ID</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Mumpacebia Dina', transaction: 'Shoes', paymentId: '#3086', date: 'Nov 28, 2023', amount: '10,000.00', status: 'Done' },
              { name: 'Mumpacebia Dina', transaction: 'Shoes', paymentId: '#3086', date: 'Nov 28, 2023', amount: '10,000.00', status: 'In progress' },
              { name: 'Mumpacebia Dina', transaction: 'Shoes', paymentId: '#3086', date: 'Nov 28, 2023', amount: '10,000.00', status: 'Done' },
              { name: 'Mumpacebia Dina', transaction: 'Shoes', paymentId: '#3086', date: 'Nov 28, 2023', amount: '10,000.00', status: 'Done' },
              { name: 'DW', transaction: 'Shoes', paymentId: '#3086', date: 'Nov 28, 2023', amount: '10,000.00', status: 'In progress' },
              { name: 'Mumpacebia Dina', transaction: 'Shoes', paymentId: '#3086', date: 'Nov 28, 2023', amount: '10,000.00', status: 'Cancelled' },
              { name: 'Mumpacebia Dina', transaction: 'Shoes', paymentId: '#3086', date: 'Nov 28, 2023', amount: '10,000.00', status: 'In progress' },
              { name: 'Mumpacebia Dina', transaction: 'Shoes', paymentId: '#3086', date: 'Nov 28, 2023', amount: '10,000.00', status: 'In progress' },
            ].map((transaction, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 flex items-center">
                  <img src="https://via.placeholder.com/40" alt="customer" className="w-10 h-10 rounded-full mr-2" />
                  {transaction.name}
                </td>
                <td className="py-2">{transaction.transaction}</td>
                <td className="py-2">{transaction.paymentId}</td>
                <td className="py-2">{transaction.date}</td>
                <td className="py-2">{transaction.amount}</td>
                <td className="py-2">
                  {transaction.status === 'Done' && <FaCheckCircle className="text-green-500" />}
                  {transaction.status === 'In progress' && <FaSync className="text-yellow-500" />}
                  {transaction.status === 'Cancelled' && <FaTimesCircle className="text-red-500" />}
                  <span className="ml-1">{transaction.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button className="text-gray-500">&laquo; Previous</button>
          <button className="text-gray-500">Next &raquo;</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
