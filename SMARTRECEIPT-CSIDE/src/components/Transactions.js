// src/components/Transactions.js

import React from 'react';

const transactions = [
  { id: 1, customer: 'Mumporeze Dina', phone: '0786 095 600', action: 'Shoes', paymentId: '#3066', date: 'Nov 28, 2023', amount: '10,000.00', status: 'Done' },
  { id: 2, customer: 'Mumporeze Dina', phone: '0786 095 600', action: 'Shoes', paymentId: '#3066', date: 'Nov 28, 2023', amount: '10,000.00', status: 'Done' },
  { id: 3, customer: 'Mumporeze Dina', phone: '0786 095 600', action: 'Shoes', paymentId: '#3066', date: 'Nov 28, 2023', amount: '10,000.00', status: 'In progress' },
  { id: 4, customer: 'Mumporeze Dina', phone: '0786 095 600', action: 'Shoes', paymentId: '#3066', date: 'Nov 28, 2023', amount: '10,000.00', status: 'Done' },
  { id: 5, customer: 'Mumporeze Dina', phone: '0786 095 600', action: 'Shoes', paymentId: '#3066', date: 'Nov 28, 2023', amount: '10,000.00', status: 'In progress' },
  { id: 6, customer: 'Mumporeze Dina', phone: '0786 095 600', action: 'Shoes', paymentId: '#3066', date: 'Nov 28, 2023', amount: '10,000.00', status: 'Cancelled' },
  { id: 7, customer: 'Mumporeze Dina', phone: '0786 095 600', action: 'Shoes', paymentId: '#3066', date: 'Nov 28, 2023', amount: '10,000.00', status: 'Cancelled' },
  { id: 8, customer: 'Mumporeze Dina', phone: '0786 095 600', action: 'Shoes', paymentId: '#3066', date: 'Nov 28, 2023', amount: '10,000.00', status: 'In progress' },
];

const Transactions = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Add transaction</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Export receipt</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Download receipt</button>
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Name of the customer</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Title/Action</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Payment ID</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Date</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Amount</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 border-b border-gray-200">{transaction.customer}</td>
              <td className="px-6 py-4 border-b border-gray-200">{transaction.action}</td>
              <td className="px-6 py-4 border-b border-gray-200">{transaction.paymentId}</td>
              <td className="px-6 py-4 border-b border-gray-200">{transaction.date}</td>
              <td className="px-6 py-4 border-b border-gray-200">{transaction.amount}</td>
              <td className="px-6 py-4 border-b border-gray-200">
                {transaction.status === 'Done' && <span className="text-green-500">✔ Done</span>}
                {transaction.status === 'In progress' && <span className="text-yellow-500">⏳ In progress</span>}
                {transaction.status === 'Cancelled' && <span className="text-red-500">✘ Cancelled</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
