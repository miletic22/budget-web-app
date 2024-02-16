import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navbar from './components/Navbar/Navbar';
import Table from './components/CategoriesTable/CategoriesTable';
import { UserProvider } from './context/UserContext';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserProvider>
      <Navbar />
      {/* <Table /> */}
      <Register />
      <Login />
    </UserProvider>
  </React.StrictMode>
);
