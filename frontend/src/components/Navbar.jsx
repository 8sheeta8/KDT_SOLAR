//Navbar.jsx

import { Link } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import "../styles/navbar.css";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/" className="brand-link">
              KDT Solar
            </Link>
          </div>
          <div className="navbar-menu">
            {user ? (
              <>
                <Link to="/orders" className="nav-link">
                  Orders
                </Link>
                <Link to="/checkout" className="nav-link nav-icon">
                  <ShoppingCartIcon className="icon" />
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    window.location.reload();
                  }}
                  className="logout-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/" className="nav-link nav-icon">
                <UserIcon className="icon" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}