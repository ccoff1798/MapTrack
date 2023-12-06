import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavTabs() {
  const currentPage = useLocation().pathname;
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Map App Name Still Working</Link>
      <button className="navbar-toggler" type="button" onClick={handleNavCollapse} aria-expanded={!isNavCollapsed} aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className={currentPage === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className={currentPage === '/about' ? 'nav-link active' : 'nav-link'}>About</Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className={currentPage === '/signup' ? 'nav-link active' : 'nav-link'}>Sign Up</Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className={currentPage === '/login' ? 'nav-link active' : 'nav-link'}>Login</Link>
          </li>
          <li className="nav-item">
            <Link to="/map" className={currentPage === '/map' ? 'nav-link active' : 'nav-link'}>Map</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavTabs;
