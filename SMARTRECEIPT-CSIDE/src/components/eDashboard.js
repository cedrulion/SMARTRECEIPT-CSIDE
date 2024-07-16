import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';
import { Chart, registerables } from 'chart.js';
import EmployeeLineChart from '../statisticsComponent/employeeLineChart';
import PercentageEmployeeSalesDoughnutChart from '../statisticsComponent/percentageChart';

// Register the required components
Chart.register(...registerables);

const EmployeeDashboard = () => {
  const [countsPerMonth, setCountsPerMonth] = useState(Array(12).fill(0));
  const [percentage, setPercentage] = useState({
    dataPresent: false,
    percentage: 0
  })
  const [employeeSalesStats, setEmployeeSalesStats] = useState({
    totalSales: "",
    totalBusinessSales: "",
    totalBusinessTransactions: "",
    totalEmployeeTransactions: ""
  })
  const [percentageChange, setPercentageChange] = useState({
    sales: "",
    businessSales: ""
  })
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const business = JSON.parse(localStorage.getItem('user')).business
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');

      try {
        // Fetch all transactions
        const transactionsResponse = await axios.post('http://localhost:5000/api/transaction/employee/monthlyreport',{ business }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const percentageResponse = await axios.post('http://localhost:5000/api/transaction/employee/stats/percentage', { business }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const employeeStatsResponse = await axios.post('http://localhost:5000/api/transaction/employee/stats', { business }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const employeeSalesResponse = await axios.post('http://localhost:5000/api/transaction/employee/sales/stats', { business }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        setPercentage({
          dataPresent: true,
          percentage: percentageResponse.data.percentage
        })
        setEmployeeSalesStats({
          totalSales: employeeSalesResponse.data.totalSalesByEmployee,
          totalBusinessSales: employeeSalesResponse.data.totalBusinessSales,
          totalBusinessTransactions: employeeSalesResponse.data.totalTransactionCount,
          totalEmployeeTransactions: employeeSalesResponse.data.totalSalesTransaction
        })
        setPercentageChange({
          sales: employeeStatsResponse.data.employeeSales.percentageChange,
          businessSales: employeeStatsResponse.data.businessSales.percentageChange
        })
        setCountsPerMonth(transactionsResponse.data.countsPerMonth.map(item => item.count));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
        setPercentage({
          percentage: 0,
          dataPresent: false
        });
      }
    };

    fetchTransactions();
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
              <h2 className="text-lg font-semibold text-gray-600">Total transactions</h2>
              <FaExchangeAlt className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{employeeSalesStats.totalEmployeeTransactions} transaction(s)</div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center mt-auto">
            <div className="flex items-center text-sm">
              <span className="text-red-500 font-medium">{employeeSalesStats.totalBusinessTransactions} transaction(s)</span>
            </div>
            <div className="text-sm text-right">
              <span className="text-gray-500">Total business transactions</span>
            </div>
          </div>

        </div>


        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className='p-6'>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-600">Total sales</h2>
              <FaExchangeAlt className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold mb-2">RWF {employeeSalesStats.totalSales}</div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
            <div className="flex items-center text-sm">
              {percentageChange.sales > 0 ? (
                <>
                  <FaArrowUp className="text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">{percentageChange.sales}%</span>
                </>
              ) : (
                <>
                  <FaArrowDown className="text-red-500 mr-1" />
                  <span className="text-red-500 font-medium">{percentageChange.sales}%</span>
                </>
              )}
            </div>
            <span className="text-gray-500 ml-1">From last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between">
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-600">Total business sales</h2>
              <FaExchangeAlt className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold">RWF {employeeSalesStats.totalBusinessSales}</div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center mt-auto">
            <div className="flex items-center text-sm">
              {percentageChange.businessSales > 0 ? (
                <>
                  <FaArrowUp className="text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">{percentageChange.businessSales}%</span>
                </>
              ) : (
                <>
                  <FaArrowDown className="text-red-500 mr-1" />
                  <span className="text-red-500 font-medium">{percentageChange.businessSales}%</span>
                </>
              )}
            </div>
            <span className="text-gray-500 text-sm">From last month</span>
          </div>
        </div>

      </div>
      <div className="flex flex-wrap justify-between">
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xs font-semibold mb-0">Sales contribution over total sales</h3>
          <PercentageEmployeeSalesDoughnutChart percentage={percentage} />
        </div>
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-5">Statistics</h3>
          <EmployeeLineChart statspermonth={countsPerMonth} />
        </div>
      </div>

    </div >
  );
};

export default EmployeeDashboard;
