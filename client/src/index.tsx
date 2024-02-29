import React from 'react';
import './index.css';
import Navbar from './components/Navbar/Navbar';
import CategoriesTable from './components/CategoriesTable/CategoriesTable';
import Login from './components/Auth/Login';
import { createRoot } from 'react-dom/client'; // Updated import
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import Layout from './components/Navbar/Layout';
import { Logout } from './utils/auth';
import TransactionsTable from './components/TransactionsTable/TransactionsTable';

const container = document.getElementById('root');
const root = createRoot(container || document.createElement('div'));

root.render(
  <BrowserRouter>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="/home" element={<Home />} />
          <Route path="/categories" element={<CategoriesTable />} />
          <Route path="/transactions" element={<TransactionsTable />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" Component={Logout} />
        </Route>
      </Routes>
    </UserProvider>
  </BrowserRouter>
);
