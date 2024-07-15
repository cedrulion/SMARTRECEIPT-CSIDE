// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import Information from './components/Information';
import Message from './components/Message';
import Sidebar from './components/Sidebar';
import Transactions from './components/Transactions';
import Etransactions from './components/Etransactions';
import Navbar from './components/Navbar';
import RraLogin from './components/RraLogin';
import Signup from './components/Signup';
import Product from './components/Product';
import Eproduct from './components/Eproduct';
import Payment from './components/Payment';
import TransactionList from './components/TransactionList';
import BusinessList from './components/BusinessList';
import Fail from './components/Fail';
import Success from './components/Success';
import InformationDetails from './components/Information copy';
import Notification from './components/Notification';
import UserManagement from './components/users';
import ActivateAccount from './components/activateAccount';
import EmployeeDashboard from './components/eDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} ></Route>

        <Route path="/login" element={<Login />} ></Route>
        <Route path="/activate-account" element={<ActivateAccount />} ></Route>
        <Route path="/signup" element={<Signup />}>
        </Route>
        <Route path="/signup/information" element={<Information />} />
        <Route path="/rra" element={<Login />} ></Route>

        <Route path="/nav" element={<Navbar />} ></Route>
        <Route path="/sidebar" element={<Sidebar />} ></Route>


        <Route path="/dashboard" element={<DashboardLayout />} >
          <Route path="transactions" element={<Transactions />} />
          <Route path="etransactions" element={<Etransactions />} />
          <Route path="dashboardd" element={<Dashboard />} />
          <Route path="message" element={<Message />} />
          <Route path="info" element={<InformationDetails />} />
          <Route path="product" element={<Product />} />
          <Route path="eproduct" element={<Eproduct />} />
          <Route path="edashboard" element={<EmployeeDashboard />} />
          <Route path="payment" element={<Payment />} />
          <Route path="list" element={<TransactionList />} />
          <Route path="blist" element={<BusinessList />} />
          <Route path="Success" element={<Success />} />
          <Route path="Fail" element={<Fail />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="Notification" element={<Notification />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
