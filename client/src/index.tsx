import React from 'react';
import './index.css';
import Navbar from './components/Navbar/Navbar';
import CategoriesTable from './components/CategoriesTable/CategoriesTable';
import Login from './components/Auth/Login';
import ClientMessage from './components/Message/MessagePopup';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import Layout from './components/Navbar/Layout';
import { Logout } from './utils/auth';

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" Component={Logout} />
        </Route>
      </Routes>
    </UserProvider>
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);