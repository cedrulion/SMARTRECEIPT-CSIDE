import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaCheckCircle, FaSync, FaTimesCircle } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import LineChart from '../statisticsComponent/lineChart';

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
        const transactionsResponse = await axios.get('http://localhost:5000/api/transaction/getall', {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Successful</span>
      case 'failed':
        return <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded ">Failed</span>
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Pending</span>
      default:
        return null;
    }
  };

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

  return (
    <div className="max-w-6xl mx-auto p-4" style={{ fontFamily: 'inter' }}>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        <LineChart statspermonth={countsPerMonth} />
      </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">Customer name</th>
                <th scope="col" className="px-6 py-3">Business name</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Total price</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{transaction.buyer.username}</td>
                  <td className="px-6 py-4">{transaction.business.businessName}</td>
                  <td className="px-6 py-4">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">RWF {transaction.totalPrice.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{transaction.totalPrice}</td>
                  <td className="px-6 py-4">{getStatusIcon(transaction.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default Dashboard;
