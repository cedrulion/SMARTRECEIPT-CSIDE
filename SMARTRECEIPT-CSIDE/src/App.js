// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import Information from './components/Information';
import Message from './components/Message';
import Sidebar from './components/Sidebar';
import Transactions from './components/Transactions';
import Navbar from './components/Navbar';
import RraLogin from './components/RraLogin';
import Signup from './components/Signup';
import Product from './components/Product';
import Payment from './components/Payment';
import TransactionList from './components/TransactionList';
import BusinessList from './components/BusinessList';
import Fail from './components/Fail';
import Success from './components/Success';
 

function App() {
  return (
    <Router>
       <Routes>
       <Route  path="/" element={<Login/>} ></Route>
       
        <Route  path="/login" element={<Login/>} ></Route>
        <Route  path="/signup" element={<Signup/>} ></Route>
        <Route  path="/rra" element={<RraLogin/>} ></Route>
        
        <Route  path="/nav" element={<Navbar/>} ></Route>
        <Route  path="/sidebar" element={<Sidebar/>} ></Route>
       
       
        <Route  path="/dashboard" element={<DashboardLayout/>} >
        <Route  path="transactions" element={<Transactions/>} />
        <Route  path="dashboardd" element={<Dashboard/>} />
        <Route  path="message" element={<Message/>} />
        <Route  path="info" element={<Information/>} />
        <Route  path="product" element={<Product/>} />
        <Route  path="payment" element={<Payment/>} />
        <Route  path="list" element={<TransactionList/>} />
        <Route  path="blist" element={<BusinessList/>} />
         <Route  path="Success" element={<Success/>} />
        <Route  path="Fail" element={<Fail/>} />
        </Route>
        </Routes>
    </Router>
  );
}

export default App;
