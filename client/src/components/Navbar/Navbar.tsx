import React from 'react';
import './Navbar.css';
import Logo from '../../assets/icon-logo.svg';

interface NavItemProps {
  url: string;
  text: string;
}

const navItems: NavItemProps[] = [
  { text: "How it works", url: "#" },
  { text: "Additional", url: "#" },
  { text: "About", url: "#" },
];

const Navbar: React.FC = () => {
  return (
    <nav>
      <div className="right-side">
        <a href="#">
          <img src={Logo} alt="Logo" />
          <p>BUDGETER</p>
        </a>
      </div>
      <div className="left-side">
        <ul>
          {navItems.map((item, index) => (
            <li key={index} className="navitem">
              <NavItem url={item.url} text={item.text} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const NavItem: React.FC<NavItemProps> = ({ url, text }) => {
  return <a href={url}>{text}</a>;
};

export default Navbar;
