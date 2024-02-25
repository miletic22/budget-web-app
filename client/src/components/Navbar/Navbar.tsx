import React from 'react';
import './Navbar.css';
import Logo from '../../assets/icon-logo.svg';
import { Link, NavLink } from 'react-router-dom';
import isLoggedIn from '../../utils/auth';

const Navbar: React.FC = () => {
  const activeStyles = {
    fontWeight: "bold",
    color: "#161616"
  };

  return (
    <nav>
      <div className="navbar-top">
        <div className="nav-logo">
          <Link to="/home">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
        <div className="nav-content">
          <ul>

            {!isLoggedIn() && (
              <>
                <li>
                  <NavLink 
                    to="/login"
                    style={({isActive}) => isActive ? activeStyles : {}}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/register"
                    style={({isActive}) => isActive ? activeStyles : {}}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
            {isLoggedIn() && (
              <>
              <li>
                <NavLink 
                  to="/home"
                  style={({isActive}) => isActive ? activeStyles : {}}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/logout"
                  style={({isActive}) => isActive ? activeStyles : {}}
                >
                  Logout
                </NavLink>
              </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="navbar-bottom">
        <a href="https://github.com/miletic22">Goran 2024</a>
      </div>
    </nav>
  );
};

export default Navbar;
