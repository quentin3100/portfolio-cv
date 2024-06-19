import React from 'react';
import './NavBar.css';


const NavBar = ({ toggleMenu }) => {
  return (
    <div id="navbar">
      <div className="nav-wrapper">
        <div className="brand">Mon portfolio</div>
        <div className="menu-button" onClick={toggleMenu}>
          <span />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
