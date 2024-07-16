import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaCheckCircle, FaSync, FaTimesCircle, FaExchangeAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import LineChart from '../statisticsComponent/lineChart';

// Register the required components
Chart.register(...registerables);

const BusinessDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [countsPerMonth, setCountsPerMonth] = useState(Array(12).fill(0));
  const [transactionsStats, setTransactionsStats] = useState({
    numberOfTransactions: 0,
    percentageChange: 0
  })
  const [productsStats, setProductsStats] = useState({
    totalProducts: "",
    percentageChange: 0
  })
  const [businessStats, setBusinessStats] = useState({
    totalSales: "",
    percentageChange: 0
  })
  const [overallStats, setOverallStats] = useState({
    totalGoodsSold: 0,
    totalStock: 0
  })
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      const business = JSON.parse(localStorage.getItem('user')).business
      try {
        const transactionsResponse = await axios.post('http://localhost:5000/api/transaction/business/get/transactions', { business }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const salesStatsResponse = await axios.post('http://localhost:5000/api/transaction/business/sales/stats', { business }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const productStatsResponse = await axios.post('http://localhost:5000/api/transaction/business/product/stats', { business }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const transactionsStatsResponse = await axios.post('http://localhost:5000/api/transaction/business/transactions/stats', { business }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const overallStatsResponse = await axios.post('http://localhost:5000/api/transaction/business/overall/stats', { business }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        setTransactionsStats({
          numberOfTransactions:transactionsStatsResponse.data.totalTransactions,
          percentageChange:transactionsStatsResponse.data.percentage
        })
        setProductsStats({
          totalProducts:productStatsResponse.data.totalProducts,
          percentageChange:productStatsResponse.data.percentage
        })
        setBusinessStats({
          totalSales:salesStatsResponse.data.totalSales,
          percentageChange:salesStatsResponse.data.percentageChange
        })
        setOverallStats({
          totalGoodsSold:overallStatsResponse.data.totalPrices,
          totalStock:overallStatsResponse.data.totalStock
        })
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
    const business = JSON.parse(localStorage.getItem('user')).business
    const fetchCountsPerMonth = async () => {
      const token = localStorage.getItem('token');
      try {
        const countsPerMonthResponse = await axios.post('http://localhost:5000/api/transaction/business/monthlyreport', { business }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          }
        });
        setCountsPerMonth(countsPerMonthResponse.data.countsPerMonth.map(item => item.count));
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
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between">
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-600">Total sales</h2>
              <FaExchangeAlt className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold"> RWF {overallStats.totalGoodsSold}</div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center mt-auto">
            <div className="flex items-center text-sm">
              <span className="text-red-500 font-medium">{overallStats.totalStock} Good(s)</span>
            </div>
            <div className="text-sm text-right">
              <span className="text-gray-500">Total Stock</span>
            </div>
          </div>

        </div>


        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className='p-6'>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-600">Number of products</h2>
              <FaExchangeAlt className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold mb-2">RWF {productsStats.totalProducts}</div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
            <div className="flex items-center text-sm">
              {productsStats.percentageChange > 0 ? (
                <>
                  <FaArrowUp className="text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">{productsStats.percentageChange}%</span>
                </>
              ) : (
                <>
                  <FaArrowDown className="text-red-500 mr-1" />
                  <span className="text-red-500 font-medium">{productsStats.percentageChange}%</span>
                </>
              )}
            </div>
            <span className="text-gray-500 ml-1">From last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between">
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-600">Total transactions</h2>
              <FaExchangeAlt className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{transactionsStats.numberOfTransactions} transaction(s)</div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center mt-auto">
            <div className="flex items-center text-sm">
              {transactionsStats.percentageChange > 0 ? (
                <>
                  <FaArrowUp className="text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">{transactions.percentageChange}%</span>
                </>
              ) : (
                <>
                  <FaArrowDown className="text-red-500 mr-1" />
                  <span className="text-red-500 font-medium">{transactions.percentageChange}%</span>
                </>
              )}
            </div>
            <span className="text-gray-500 text-sm">From last month</span>
          </div>
        </div>
      </div>
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

export default BusinessDashboard;
