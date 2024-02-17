import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import './index.css';
import Navbar from './components/Navbar/Navbar';
import CategoriesTable from './components/CategoriesTable/CategoriesTable';
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
      {/* <CategoriesTable /> */}
      <Register />
      <Login />
    </UserProvider>
  </React.StrictMode>
);


// <BrowserRouter>
//   <Routes>  
//     <Route path="/" element={<Layout />}>
//       <Route index element={<Home />} />
//       <Route path="about" element={<About />} />

//       <Route path='categories' element={<CategoriesTable />}>
//       </Route>
//     </Route>
//   </Routes>
// </BrowserRouter>
