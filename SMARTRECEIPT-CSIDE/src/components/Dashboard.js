import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaCheckCircle, FaSync, FaTimesCircle } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register the required components
Chart.register(...registerables);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [countsPerMonth, setCountsPerMonth] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');

      try {
        // Fetch all transactions
        const transactionsResponse = await axios.get('http://localhost:5000/api/transaction/get', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        setTransactions(transactionsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchCountsPerMonth = async () => {
      const token = localStorage.getItem('token');

      try {
        // Fetch transaction counts per month based on date range
        const countsPerMonthResponse = await axios.get('http://localhost:5000/api/transaction/monthlyreport', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          }
        });
        setCountsPerMonth(countsPerMonthResponse.data.countsPerMonth.map(item => item.count));
        console.log(countsPerMonthResponse.data.countsPerMonth.map(item => item.count));

      } catch (error) {
        console.error('Error fetching counts per month:', error);
      }
    };

    
      fetchCountsPerMonth();
    
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Data for the chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Transactions',
        data: countsPerMonth,
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
    <div className="max-w-6xl mx-auto p-4" style={{ fontFamily: 'inter' }}>
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
        <div className="flex items-center mb-4">
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="mr-2 p-2 border rounded" 
          />
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="mr-2 p-2 border rounded" 
          />
        </div>
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
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 flex items-center">
                  <img src="https://via.placeholder.com/40" alt="customer" className="w-10 h-10 rounded-full mr-2" />
                  {transaction.buyer.username}
                </td>
                <td className="border px-4 py-2">
                    {transaction.products.map((product) => (
                      <div key={product._id}>
                        {product.product.name}
                      </div>
                    ))}
                  </td>
                <td className="py-2">{transaction._id}</td>
                <td className="py-2">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                <td className="py-2">${transaction.totalPrice.toFixed(2)}</td>
                <td className="py-2">
                  {transaction.status === 'succeeded' && <FaCheckCircle className="text-green-500" />}
                  {transaction.status === 'pending' && <FaSync className="text-yellow-500" />}
                  {transaction.status === 'failed' && <FaTimesCircle className="text-red-500" />}
                  <span className="ml-1">{transaction.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
