import React from 'react';
import './Menu.css';

const Menu = (props) => {
  return (
    <div className={`menu-container ${props.showMenu ? 'active' : 'deactive'}`}>
      <div className="overlay" onClick={props.toggleMenu} />
      <div className="menu-items">
        <ul>
          <li>
            <a href="/" onClick={props.toggleMenu}>
              ACCUEIL
            </a>
          </li>
          <li>
            <a href="/about" onClick={props.toggleMenu}>
              A PROPOS
            </a>
          </li>
          <li>
            <a href="/all-projects" onClick={props.toggleMenu}>
              PORTFOLIO
            </a>
          </li>
          <li>
            <a href="/contact" onClick={props.toggleMenu}>
              CONTACT
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
